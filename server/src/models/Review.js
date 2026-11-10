const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  targetId: { type: String, required: true },
  targetType: { type: String, enum: ['destination', 'hotel', 'tour'], default: 'destination' },
  userId: { type: String, default: null },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, default: '' },
  comment: { type: String, required: true },
  verifiedVisit: { type: Boolean, default: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, {
  timestamps: true
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
