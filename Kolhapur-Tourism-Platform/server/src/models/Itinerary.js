const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userId: { type: String, default: null },
  planTitle: { type: String, required: true },
  durationDays: { type: Number, required: true },
  pace: { type: String, default: 'Moderate' },
  interests: [{ type: String }],
  budgetLevel: { type: String, default: 'Standard' },
  estimatedTotalBudget: { type: Number, default: 0 },
  days: { type: mongoose.Schema.Types.Mixed },
  summary: { type: String, default: '' },
  aiGenerated: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);
