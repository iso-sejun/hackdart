const express = require('express');

const pickupController = require('../controllers/pickupController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validatePickupLookup } = require('../validators/pickupValidators');

const router = express.Router();

router.post(
  '/lookup',
  requireAuth,
  requireRole('buyer'),
  validatePickupLookup,
  pickupController.lookupPickupOptions
);

module.exports = router;
