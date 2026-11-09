const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/', eventsController.getAllEvents);
router.post('/', requireAdmin, eventsController.createEvent);
router.delete('/:id', requireAdmin, eventsController.deleteEvent);

module.exports = router;
