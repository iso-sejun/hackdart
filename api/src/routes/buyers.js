const express = require('express');

const buyerController = require('../controllers/buyerController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireRole('buyer'));

router.get('/me/orders', buyerController.listOrders);

module.exports = router;
