const checkoutService = require('../services/checkoutService');

async function validateCheckout(req, res, next) {
  try {
    const result = await checkoutService.validateCheckout(req.auth.sub, req.body);

    res.json({
      data: checkoutService.serializeValidationResult(result),
    });
  } catch (error) {
    next(error);
  }
}

async function createCheckoutSession(req, res, next) {
  try {
    const result = await checkoutService.createCheckoutSession(req.auth.sub, req.body);

    res.status(201).json({
      data: {
        orderGroupId: result.orderGroup._id,
        checkoutSessionId: result.session.id,
        checkoutUrl: result.session.url,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateCheckout,
  createCheckoutSession,
};
