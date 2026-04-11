const sellerService = require('../services/sellerService');

function serializeProfile(profile) {
  return {
    id: profile._id,
    farmName: profile.farmName,
    contactName: profile.contactName,
    phone: profile.phone,
    email: profile.email,
    description: profile.description,
    foodSafetyAttested: profile.foodSafetyAttested,
    foodSafetyAttestedAt: profile.foodSafetyAttestedAt,
    foodSafetyTermsVersion: profile.foodSafetyTermsVersion,
    stripeOnboardingStatus: profile.stripeOnboardingStatus,
    farmAddress: profile.farmAddress,
  };
}

async function getMe(req, res, next) {
  try {
    const profile = await sellerService.getSellerProfile(req.auth.sub);

    res.json({
      data: serializeProfile(profile),
    });
  } catch (error) {
    next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const profile = await sellerService.updateSellerProfile(req.auth.sub, req.body);

    res.json({
      data: serializeProfile(profile),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMe,
  updateMe,
};
