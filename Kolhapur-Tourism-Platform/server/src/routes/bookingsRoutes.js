const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, bookingsController.create);
router.get('/my-bookings', requireAuth, bookingsController.getMyBookings);
router.get('/track/:reference', bookingsController.getByReference);
router.put('/:id/cancel', optionalAuth, bookingsController.cancelBooking);

// Admin routes
router.get('/', requireAdmin, bookingsController.getAll);
router.put('/:id/status', requireAdmin, bookingsController.updateStatus);

module.exports = router;
