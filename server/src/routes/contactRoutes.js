const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.post('/', contactController.submitContact);
router.get('/support', contactController.getFaqsAndSupport);
router.get('/', requireAdmin, contactController.getAllMessages);
router.put('/:id/status', requireAdmin, contactController.updateMessageStatus);

module.exports = router;
