const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  reference: { type: String },
  referenceCode: { type: String, required: true, unique: true },
  userId: { type: String, default: null },
  type: { type: String, default: 'tour' },
  targetId: { type: String, default: '' },
  targetName: { type: String, default: '' },
  destinationOrHotel: { type: String, default: '' },
  travelDate: { type: String, required: true },
  checkOutDate: { type: String, default: '' },
  travellers: { type: mongoose.Schema.Types.Mixed, default: 1 },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, default: '' }
  },
  accommodationPreference: { type: String, default: 'Standard' },
  estimatedPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'Pay on Arrival' },
  paymentStatus: { type: String, default: 'Pending' },
  status: { type: String, default: 'Confirmed' },
  specialRequests: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
