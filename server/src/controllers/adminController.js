const db = require('../db/dbService');

exports.getDashboardStats = (req, res) => {
  try {
    const users = db.getCollection('users');
    const destinations = db.getCollection('destinations');
    const hotels = db.getCollection('hotels');
    const bookings = db.getCollection('bookings');
    const messages = db.getCollection('contactMessages');
    const reviews = db.getCollection('reviews');

    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const newInquiries = messages.filter(m => m.status === 'New').length;

    // Recent 5 bookings
    const recentBookings = [...bookings].slice(0, 5);

    // Recent 5 inquiries
    const recentMessages = [...messages].slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalDestinations: destinations.length,
        totalHotels: hotels.length,
        totalBookings: bookings.length,
        confirmedBookings,
        pendingBookings,
        totalInquiries: messages.length,
        pendingInquiries: newInquiries,
        totalReviews: reviews.length
      },
      recentBookings,
      recentMessages
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFoodAndCulture = (req, res) => {
  try {
    const foodItems = db.getCollection('foodItems');
    const culture = db.getCollection('culture');
    res.json({
      success: true,
      foodItems,
      culinary: foodItems,
      culture
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
