const express = require('express');

const checkoutController = require('../controllers/checkoutController');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  validateCheckoutPayload,
  validateCheckoutSessionPayload,
} = require('../validators/checkoutValidators');

const router = express.Router();

router.use(requireAuth, requireRole('buyer'));

router.post('/validate', validateCheckoutPayload, checkoutController.validateCheckout);
router.post('/demo-place-order', validateCheckoutPayload, checkoutController.placeDemoOrder);
router.post('/session', validateCheckoutSessionPayload, checkoutController.createCheckoutSession);

module.exports = router;
