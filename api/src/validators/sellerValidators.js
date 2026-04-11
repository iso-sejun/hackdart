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

function validateAddress(address, field) {
  if (!address || typeof address !== 'object') {
    throw createValidationError(`${field} is required`, field);
  }

  ['line1', 'city', 'state', 'postalCode', 'country'].forEach((key) => {
    validateRequiredString(address[key], `${field}.${key}`);
  });
}

function validateSellerProfileUpdate(req, _res, next) {
  try {
    const { farmName, contactName, phone, description, email, farmAddress } = req.body;

    if (farmName !== undefined) {
      validateRequiredString(farmName, 'farmName', 2);
    }

    if (contactName !== undefined) {
      validateRequiredString(contactName, 'contactName', 2);
    }

    if (phone !== undefined) {
      validateRequiredString(phone, 'phone', 7);
    }

    if (description !== undefined && typeof description !== 'string') {
      throw createValidationError('description must be a string', 'description');
    }

    if (email !== undefined) {
      validateRequiredString(email, 'email', 3);
    }

    if (farmAddress !== undefined) {
      validateAddress(farmAddress, 'farmAddress');
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateSellerProfileUpdate,
};
