const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  marathiName: { type: String, default: '' },
  category: { type: String, required: true },
  tag: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  history: { type: String, default: '' },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 0 },
  reviewsList: [
    {
      author: String,
      rating: Number,
      date: String,
      comment: String
    }
  ],
  bestSeason: { type: String, default: 'October to March' },
  visitingDuration: { type: String, default: '2-3 hours' },
  travelTips: [{ type: String }],
  timings: { type: String, default: '6:00 AM - 9:00 PM' },
  entryFee: { type: String, default: 'Free' },
  location: {
    address: { type: String, default: '' },
    distanceFromCityCenter: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: 16.705 },
      lng: { type: Number, default: 74.2433 }
    }
  },
  distanceKm: { type: Number, default: 0 },
  attractions: [{ type: String }],
  facilities: [{ type: String }],
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
