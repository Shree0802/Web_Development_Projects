const express = require('express');
const router = express.Router();
const hotelsController = require('../controllers/hotelsController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/', hotelsController.getAll);
router.get('/:id', hotelsController.getById);
router.post('/', requireAdmin, hotelsController.create);
router.put('/:id', requireAdmin, hotelsController.update);
router.delete('/:id', requireAdmin, hotelsController.delete);

module.exports = router;
