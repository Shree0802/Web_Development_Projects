const db = require('../db/dbService');

exports.getAll = (req, res) => {
  try {
    const { category, search, sort, featured } = req.query;
    let list = db.findAll('destinations');

    if (category && category !== 'all') {
      list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      list = list.filter(item => item.featured === true);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        (item.marathiName && item.marathiName.includes(q)) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
      );
    }

    if (sort) {
      if (sort === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'distance_asc') {
        list.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      } else if (sort === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = (req, res) => {
  try {
    const { id } = req.params;
    let destination = db.findById('destinations', id);

    // Flexible fallback: match clean slug or partial name
    if (!destination) {
      const cleanId = id.toLowerCase().replace(/[^a-z0-9]/g, '');
      destination = db.findAll('destinations', d => {
        const cleanDId = d.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanDName = d.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanDId.includes(cleanId) || cleanId.includes(cleanDId) || cleanDName.includes(cleanId);
      })[0];
    }

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    // Also attach verified reviews
    const reviews = db.findAll('reviews', r => r.targetType === 'destination' && (r.targetId === id || r.targetId === destination.id));

    res.json({
      success: true,
      data: {
        ...destination,
        reviews
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = (req, res) => {
  try {
    const destinationData = req.body;
    if (!destinationData.name || !destinationData.category) {
      return res.status(400).json({ success: false, message: 'Name and category are required.' });
    }

    const id = destinationData.id || destinationData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newDestination = {
      ...destinationData,
      id,
      rating: destinationData.rating || 4.5,
      reviewCount: destinationData.reviewCount || 0,
      createdAt: new Date().toISOString()
    };

    db.insert('destinations', newDestination);
    res.status(201).json({ success: true, message: 'Destination added successfully!', data: newDestination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.update('destinations', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }
    res.json({ success: true, message: 'Destination updated successfully!', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const removed = db.delete('destinations', id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }
    res.json({ success: true, message: 'Destination deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
