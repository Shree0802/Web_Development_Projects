const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targetId: { type: String, required: true },
  targetType: { type: String, enum: ['destination', 'hotel', 'tour'], default: 'destination' },
  itemData: { type: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

WishlistSchema.index({ userId: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
