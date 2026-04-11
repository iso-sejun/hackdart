const authService = require('../services/authService');

function serializeUser(user) {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

function serializeProfile(profile, role) {
  if (!profile) {
    return null;
  }

  if (role === 'buyer') {
    return {
      id: profile._id,
      fullName: profile.fullName,
      phone: profile.phone,
      defaultAddress: profile.defaultAddress,
      pickupRadiusMiles: profile.pickupRadiusMiles,
      eligibilityMode: profile.eligibilityMode,
      eligibilityStatus: profile.eligibilityStatus,
    };
  }

  if (role === 'seller') {
    return {
      id: profile._id,
      farmName: profile.farmName,
      contactName: profile.contactName,
      phone: profile.phone,
      email: profile.email,
      description: profile.description,
      farmAddress: profile.farmAddress,
      foodSafetyAttested: profile.foodSafetyAttested,
      foodSafetyAttestedAt: profile.foodSafetyAttestedAt,
      foodSafetyTermsVersion: profile.foodSafetyTermsVersion,
      stripeOnboardingStatus: profile.stripeOnboardingStatus,
    };
  }

  return null;
}

async function registerBuyer(req, res, next) {
  try {
    const result = await authService.registerBuyer(req.body);

    res.status(201).json({
      data: {
        token: result.token,
        user: serializeUser(result.user),
        profile: serializeProfile(result.profile, result.user.role),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function registerSeller(req, res, next) {
  try {
    const result = await authService.registerSeller(req.body);

    res.status(201).json({
      data: {
        token: result.token,
        user: serializeUser(result.user),
        profile: serializeProfile(result.profile, result.user.role),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    res.json({
      data: {
        token: result.token,
        user: serializeUser(result.user),
        profile: serializeProfile(result.profile, result.user.role),
      },
    });
  } catch (error) {
    next(error);
  }
}

function logout(_req, res) {
  res.json({
    data: {
      success: true,
    },
  });
}

async function me(req, res, next) {
  try {
    const result = await authService.getCurrentUser(req.auth);

    res.json({
      data: {
        user: serializeUser(result.user),
        profile: serializeProfile(result.profile, result.user.role),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerBuyer,
  registerSeller,
  login,
  logout,
  me,
};
