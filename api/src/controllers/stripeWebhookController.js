const stripe = require('stripe');

const checkoutService = require('../services/checkoutService');

async function handleStripeWebhook(req, res, next) {
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      const error = new Error('Missing STRIPE_WEBHOOK_SECRET');
      error.statusCode = 500;
      error.code = 'STRIPE_NOT_CONFIGURED';
      throw error;
    }

    const signature = req.headers['stripe-signature'];

    if (!signature) {
      const error = new Error('Missing Stripe signature');
      error.statusCode = 400;
      error.code = 'STRIPE_SIGNATURE_MISSING';
      throw error;
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      await checkoutService.applySuccessfulCheckoutSession(event.data.object, event.id, event.type);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleStripeWebhook,
};
