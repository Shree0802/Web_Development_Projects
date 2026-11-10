const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  marathiName: { type: String, default: '' },
  category: { type: String, default: 'Delicacy' },
  spiceLevel: { type: String, default: 'Medium' },
  veg: { type: Boolean, default: true },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  famousPlaces: [
    {
      name: String,
      area: String,
      rating: Number,
      timings: String,
      specialty: String
    }
  ],
  cookingStyle: { type: String, default: '' },
  priceRange: { type: String, default: '₹80 - ₹350' }
}, {
  timestamps: true
});

module.exports = mongoose.models.FoodItem || mongoose.model('FoodItem', FoodItemSchema);
