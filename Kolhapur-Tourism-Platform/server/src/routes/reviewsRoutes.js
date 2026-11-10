const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { optionalAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', reviewsController.getByTarget);
router.post('/', optionalAuth, reviewsController.create);
router.delete('/:id', requireAdmin, reviewsController.delete);

module.exports = router;
