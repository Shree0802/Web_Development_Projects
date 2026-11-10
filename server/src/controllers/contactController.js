const db = require('../db/dbService');

exports.submitContact = (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Kolhapur Tourism Enquiry',
      message: message.trim(),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    db.insert('contactMessages', newMessage);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your enquiry has been recorded and a tourism specialist will respond shortly.',
      data: newMessage
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllMessages = (req, res) => {
  try {
    const messages = db.findAll('contactMessages');
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMessageStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = db.update('contactMessages', id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    res.json({ success: true, message: `Status updated to ${status}.`, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFaqsAndSupport = (req, res) => {
  try {
    const faqs = db.getCollection('faqs');
    const emergencyContacts = db.getCollection('emergencyContacts');
    res.json({
      success: true,
      faqs,
      emergencyContacts,
      emergency: emergencyContacts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
