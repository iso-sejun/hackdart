const Stripe = require('stripe');

let stripeClient = null;

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error('Missing STRIPE_SECRET_KEY');
    error.statusCode = 500;
    error.code = 'STRIPE_NOT_CONFIGURED';
    throw error;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

module.exports = {
  getStripeClient,
};
