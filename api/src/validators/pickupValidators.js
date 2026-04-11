function createValidationError(message, field) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  error.details = field ? { field } : null;
  return error;
}

function validateRequiredString(value, field, minLength = 1) {
  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw createValidationError(`${field} is required`, field);
  }
}

function validatePickupLookup(req, _res, next) {
  try {
    const { address, radiusMiles } = req.body;

    if (!address || typeof address !== 'object') {
      throw createValidationError('address is required', 'address');
    }

    ['line1', 'city', 'state', 'postalCode', 'country'].forEach((field) => {
      validateRequiredString(address[field], `address.${field}`);
    });

    if (!Number.isInteger(radiusMiles) || radiusMiles < 1 || radiusMiles > 25) {
      throw createValidationError(
        'radiusMiles must be an integer between 1 and 25',
        'radiusMiles'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validatePickupLookup,
};
