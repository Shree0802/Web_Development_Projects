const express = require('express');
const router = express.Router();
const destinationsController = require('../controllers/destinationsController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/', destinationsController.getAll);
router.get('/:id', destinationsController.getById);
router.post('/', requireAdmin, destinationsController.create);
router.put('/:id', requireAdmin, destinationsController.update);
router.delete('/:id', requireAdmin, destinationsController.delete);

module.exports = router;
