const db = require('../db/dbService');
const models = require('../models');
const { getIsConnected } = require('../config/db');

function generateBookingReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `KOL-2026-${random}`;
}

exports.create = (req, res) => {
  try {
    const body = req.body || {};
    const type = body.type || body.bookingType || 'destination_tour';
    const destinationOrHotel = body.destinationOrHotel || body.targetTitle || body.targetId || body.destination;
    const travelDate = body.travelDate || body.date;
    const checkOutDate = body.checkOutDate;
    const travellers = body.travellers || { adults: body.guests || body.adults || 1, children: body.children || 0 };
    const accommodationPreference = body.accommodationPreference;
    const estimatedPrice = body.estimatedPrice || body.totalPrice;
    const specialRequests = body.specialRequests || '';

    // Normalize customer info (support nested or flat)
    const customer = body.customer || {
      name: body.name,
      email: body.email,
      phone: body.phone,
      city: body.city
    };

    // Validation
    if (!destinationOrHotel) {
      return res.status(400).json({ success: false, message: 'Please select a destination, hotel, or tour package.' });
    }
    if (!travelDate) {
      return res.status(400).json({ success: false, message: 'Please provide a valid travel date.' });
    }
    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ success: false, message: 'Please provide complete contact information (name, email, phone).' });
    }

    // Phone validation
    const phoneClean = customer.phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number.' });
    }

    // Calculate realistic price if not supplied
    let finalPrice = estimatedPrice;
    if (!finalPrice || finalPrice <= 0) {
      const adults = (travellers && travellers.adults) || 1;
      if (type === 'hotel') {
        finalPrice = adults * 2200;
      } else {
        finalPrice = adults * 1500;
      }
    }

    const reference = generateBookingReference();
    const newBooking = {
      id: reference,
      reference,
      referenceCode: reference,
      userId: req.user ? req.user.id : 'guest',
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        city: customer.city ? customer.city.trim() : 'Not Specified'
      },
      type: type || 'destination_tour',
      destinationOrHotel: destinationOrHotel.trim(),
      travelDate,
      checkOutDate: checkOutDate || travelDate,
      travellers: {
        adults: (travellers && travellers.adults) || 1,
        children: (travellers && travellers.children) || 0
      },
      accommodationPreference: accommodationPreference || 'Standard Option',
      estimatedPrice: Number(finalPrice),
      totalPrice: Number(finalPrice),
      specialRequests: specialRequests || '',
      status: 'Confirmed', // realistic confirmation workflow
      paymentMode: 'Pay at Check-in / Direct Devasthan Verification',
      createdAt: new Date().toISOString()
    };

    db.insert('bookings', newBooking);

    if (getIsConnected()) {
      try {
        models.Booking.findOneAndUpdate(
          { referenceCode: reference },
          newBooking,
          { upsert: true }
        ).catch(e => console.warn('Mongo booking save error:', e.message));
      } catch (mErr) {
        console.warn('Mongo booking exception:', mErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking enquiry registered successfully!',
      reference,
      referenceCode: reference,
      data: newBooking,
      booking: newBooking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyBookings = (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email.toLowerCase();

    const bookings = db.findAll('bookings', b => 
      b.userId === userId || 
      (b.customer && b.customer.email.toLowerCase() === userEmail)
    );

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getByReference = (req, res) => {
  try {
    const { reference } = req.params;
    const booking = db.findAll('bookings', b => 
      b.id.toUpperCase() === reference.toUpperCase() || 
      b.reference === reference.toUpperCase()
    )[0];

    if (!booking) {
      return res.status(404).json({ success: false, message: 'No booking found matching reference ' + reference });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = db.findById('bookings', id);
    if (!booking) {
      booking = db.findAll('bookings', b => b.reference === id || b.referenceCode === id)[0];
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check ownership if user is logged in
    if (req.user && req.user.role !== 'admin' && booking.userId !== req.user.id && booking.customer?.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
    }

    const updated = db.update('bookings', booking.id, { status: 'Cancelled' });

    if (getIsConnected()) {
      try {
        await models.Booking.findOneAndUpdate(
          { $or: [{ id: booking.id }, { referenceCode: booking.referenceCode || booking.reference || id }] },
          { status: 'Cancelled' },
          { new: true }
        );
      } catch (mErr) {
        console.warn('Mongo status cancel exception:', mErr.message);
      }
    }
    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = (req, res) => {
  try {
    const bookings = db.findAll('bookings');
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status value. Allowed: Pending, Confirmed, Completed, Cancelled' });
    }

    let booking = db.findById('bookings', id);
    if (!booking) {
      booking = db.findAll('bookings', b => b.reference === id || b.referenceCode === id)[0];
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const updated = db.update('bookings', booking.id, { status: normalizedStatus });

    if (getIsConnected()) {
      try {
        await models.Booking.findOneAndUpdate(
          { $or: [{ id: booking.id }, { referenceCode: booking.referenceCode || booking.reference || id }] },
          { status: normalizedStatus },
          { new: true }
        );
      } catch (mErr) {
        console.warn('Mongo status update exception:', mErr.message);
      }
    }

    res.json({
      success: true,
      message: `Booking status changed to ${normalizedStatus}.`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
