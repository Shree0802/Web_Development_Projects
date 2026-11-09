const mongoose = require('mongoose');

const CultureItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  marathiTitle: { type: String, default: '' },
  category: { type: String, default: 'Living Heritage' },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
  badge: { type: String, default: 'Cultural Jewel' }
}, {
  timestamps: true
});

module.exports = mongoose.models.CultureItem || mongoose.model('CultureItem', CultureItemSchema);
