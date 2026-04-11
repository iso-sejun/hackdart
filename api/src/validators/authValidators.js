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

function validateEmail(email) {
  validateRequiredString(email, 'email', 3);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw createValidationError('email must be valid', 'email');
  }
}

function validatePassword(password) {
  validateRequiredString(password, 'password', 8);
}

function validateAddress(address, field) {
  if (!address || typeof address !== 'object') {
    throw createValidationError(`${field} is required`, field);
  }

  ['line1', 'city', 'state', 'postalCode', 'country'].forEach((key) => {
    validateRequiredString(address[key], `${field}.${key}`);
  });
}

function validateBuyerRegistration(req, _res, next) {
  try {
    const { email, password, fullName, phone, address, pickupRadiusMiles, eligibilityMode } =
      req.body;

    validateEmail(email);
    validatePassword(password);
    validateRequiredString(fullName, 'fullName', 2);
    validateRequiredString(phone, 'phone', 7);
    validateAddress(address, 'address');

    if (!Number.isInteger(pickupRadiusMiles) || pickupRadiusMiles < 1 || pickupRadiusMiles > 25) {
      throw createValidationError(
        'pickupRadiusMiles must be an integer between 1 and 25',
        'pickupRadiusMiles'
      );
    }

    const allowedEligibilityModes = ['self_attested', 'partner_verified', 'invite_code'];
    if (eligibilityMode && !allowedEligibilityModes.includes(eligibilityMode)) {
      throw createValidationError('eligibilityMode is invalid', 'eligibilityMode');
    }

    req.body.email = email.toLowerCase().trim();
    next();
  } catch (error) {
    next(error);
  }
}

function validateSellerRegistration(req, _res, next) {
  try {
    const {
      email,
      password,
      farmName,
      contactName,
      phone,
      farmAddress,
      foodSafetyAttested,
      foodSafetyTermsVersion,
    } = req.body;

    validateEmail(email);
    validatePassword(password);
    validateRequiredString(farmName, 'farmName', 2);
    validateRequiredString(contactName, 'contactName', 2);
    validateRequiredString(phone, 'phone', 7);
    validateAddress(farmAddress, 'farmAddress');

    if (foodSafetyAttested !== true) {
      throw createValidationError(
        'foodSafetyAttested must be accepted to create a seller account',
        'foodSafetyAttested'
      );
    }

    validateRequiredString(foodSafetyTermsVersion, 'foodSafetyTermsVersion', 2);

    req.body.email = email.toLowerCase().trim();
    next();
  } catch (error) {
    next(error);
  }
}

function validateLogin(req, _res, next) {
  try {
    const { email, password } = req.body;

    validateEmail(email);
    validatePassword(password);

    req.body.email = email.toLowerCase().trim();
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateBuyerRegistration,
  validateSellerRegistration,
  validateLogin,
};
