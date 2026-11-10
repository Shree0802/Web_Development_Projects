const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

router.post('/generate', itineraryController.generateItinerary);
router.post('/chat', itineraryController.chatAssistant);

module.exports = router;
