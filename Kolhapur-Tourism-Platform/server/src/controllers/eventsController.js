const db = require('../db/dbService');

exports.getAllEvents = (req, res) => {
  try {
    const events = db.findAll('events');
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEvent = (req, res) => {
  try {
    const eventData = req.body;
    if (!eventData.title || !eventData.location) {
      return res.status(400).json({ success: false, message: 'Event title and location are required.' });
    }

    const newEvent = {
      ...eventData,
      id: eventData.id || `evt_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    db.insert('events', newEvent);
    res.status(201).json({ success: true, message: 'Event published successfully!', data: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEvent = (req, res) => {
  try {
    const { id } = req.params;
    const removed = db.delete('events', id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
