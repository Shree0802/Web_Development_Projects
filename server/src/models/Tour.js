const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  marathiName: { type: String, default: '' },
  duration: { type: String, required: true },
  daysCount: { type: Number, default: 1 },
  destinationsCount: { type: Number, default: 4 },
  category: { type: String, default: 'General' },
  tripType: { type: String, default: 'Cultural & Heritage' },
  priceTier: { type: String, default: 'Moderate' },
  estimatedPrice: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 0 },
  highlights: [{ type: String }],
  description: { type: String, default: '' },
  itinerary: [
    {
      day: Number,
      title: String,
      places: [String],
      description: String,
      meals: String
    }
  ],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.models.Tour || mongoose.model('Tour', TourSchema);
