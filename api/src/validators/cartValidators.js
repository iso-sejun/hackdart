function createValidationError(message, field) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  error.details = field ? { field } : null;
  return error;
}

function validateQuantity(quantity, field = 'quantity') {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw createValidationError(`${field} must be an integer greater than or equal to 1`, field);
  }
}

function validateCartItemCreate(req, _res, next) {
  try {
    const { productId, quantity } = req.body;

    if (typeof productId !== 'string' || !productId.trim()) {
      throw createValidationError('productId is required', 'productId');
    }

    validateQuantity(quantity);
    next();
  } catch (error) {
    next(error);
  }
}

function validateCartItemUpdate(req, _res, next) {
  try {
    validateQuantity(req.body.quantity);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateCartItemCreate,
  validateCartItemUpdate,
};
