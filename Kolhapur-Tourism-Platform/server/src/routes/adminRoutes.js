const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/stats', requireAdmin, adminController.getDashboardStats);
router.get('/food-and-culture', adminController.getFoodAndCulture);

module.exports = router;
