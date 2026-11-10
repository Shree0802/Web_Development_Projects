const db = require('../db/dbService');

exports.getAllTours = (req, res) => {
  try {
    const { category, priceTier, duration, search } = req.query;
    let list = db.findAll('tours');

    if (category && category !== 'all') {
      list = list.filter(t => t.category.toLowerCase().includes(category.toLowerCase()) || (t.tripType && t.tripType.toLowerCase().includes(category.toLowerCase())));
    }

    if (priceTier && priceTier !== 'all') {
      list = list.filter(t => t.priceTier.toLowerCase() === priceTier.toLowerCase());
    }

    if (duration && duration !== 'all') {
      list = list.filter(t => t.duration.toLowerCase().includes(duration.toLowerCase()));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
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

exports.getTourById = (req, res) => {
  try {
    const { id } = req.params;
    const tour = db.findById('tours', id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGallery = (req, res) => {
  try {
    const { category } = req.query;
    let list = db.getCollection('gallery');
    if (category && category !== 'all') {
      list = list.filter(g => g.category.toLowerCase() === category.toLowerCase());
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
