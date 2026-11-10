const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  marathiName: { type: String, default: '' },
  type: { type: String, required: true },
  category: { type: String, default: 'Hotel' },
  pricePerNight: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  reviewsList: [
    {
      author: String,
      rating: Number,
      date: String,
      comment: String
    }
  ],
  location: {
    address: { type: String, default: '' },
    distanceFromTemple: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: 16.705 },
      lng: { type: Number, default: 74.2433 }
    }
  },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  amenities: [{ type: String }],
  description: { type: String, default: '' },
  rooms: [
    {
      type: { type: String },
      price: Number,
      capacity: String,
      features: [String]
    }
  ],
  contact: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
