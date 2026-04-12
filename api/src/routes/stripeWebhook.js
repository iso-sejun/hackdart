const express = require('express');

const stripeWebhookController = require('../controllers/stripeWebhookController');

const router = express.Router();

router.post('/', stripeWebhookController.handleStripeWebhook);

module.exports = router;
