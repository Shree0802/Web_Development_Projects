const db = require('../db/dbService');

exports.getAll = (req, res) => {
  try {
    const { type, search, sort } = req.query;
    let list = db.findAll('hotels');

    if (type && type !== 'all') {
      list = list.filter(item => item.type.toLowerCase().includes(type.toLowerCase()));
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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
    const hotel = db.findById('hotels', id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const reviews = db.findAll('reviews', r => r.targetType === 'hotel' && r.targetId === id);

    res.json({
      success: true,
      data: {
        ...hotel,
        reviews
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = (req, res) => {
  try {
    const hotelData = req.body;
    const type = hotelData.type || hotelData.category;
    if (!hotelData.name || !type) {
      return res.status(400).json({ success: false, message: 'Hotel name and category are required.' });
    }

    const id = hotelData.id || hotelData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newHotel = {
      ...hotelData,
      id,
      type,
      category: type,
      rating: hotelData.rating || 4.2,
      verified: true,
      createdAt: new Date().toISOString()
    };

    db.insert('hotels', newHotel);
    res.status(201).json({ success: true, message: 'Hotel registered successfully!', data: newHotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.update('hotels', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }
    res.json({ success: true, message: 'Hotel updated successfully!', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const removed = db.delete('hotels', id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }
    res.json({ success: true, message: 'Hotel deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
