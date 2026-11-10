const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController');

router.get('/', toursController.getAllTours);
router.get('/gallery', toursController.getGallery);
router.get('/:id', toursController.getTourById);

module.exports = router;
