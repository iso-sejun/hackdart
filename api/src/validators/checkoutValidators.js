function createValidationError(message, field) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  error.details = field ? { field } : null;
  return error;
}

function validateAddress(address) {
  if (!address || typeof address !== 'object') {
    throw createValidationError('pickupAddress is required', 'pickupAddress');
  }

  const requiredFields = ['line1', 'city', 'state', 'postalCode', 'country'];

  requiredFields.forEach((field) => {
    if (typeof address[field] !== 'string' || !address[field].trim()) {
      throw createValidationError(`pickupAddress.${field} is required`, `pickupAddress.${field}`);
    }
  });
}

function validateCheckoutPayload(req, _res, next) {
  try {
    const { foodBankId, pickupAddress } = req.body;

    if (typeof foodBankId !== 'string' || !foodBankId.trim()) {
      throw createValidationError('foodBankId is required', 'foodBankId');
    }

    validateAddress(pickupAddress);
    next();
  } catch (error) {
    next(error);
  }
}

function validateCheckoutSessionPayload(req, _res, next) {
  try {
    const { successUrl, cancelUrl } = req.body;

    validateCheckoutPayload(req, _res, (error) => {
      if (error) {
        throw error;
      }
    });

    if (typeof successUrl !== 'string' || !successUrl.trim()) {
      throw createValidationError('successUrl is required', 'successUrl');
    }

    if (typeof cancelUrl !== 'string' || !cancelUrl.trim()) {
      throw createValidationError('cancelUrl is required', 'cancelUrl');
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateCheckoutPayload,
  validateCheckoutSessionPayload,
};
