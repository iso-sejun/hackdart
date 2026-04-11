const SellerProfile = require('../models/SellerProfile');

async function getSellerProfile(userId) {
  const profile = await SellerProfile.findOne({ userId });

  if (!profile) {
    const error = new Error('Seller profile not found');
    error.statusCode = 404;
    error.code = 'SELLER_PROFILE_NOT_FOUND';
    throw error;
  }

  return profile;
}

async function updateSellerProfile(userId, updates) {
  const profile = await getSellerProfile(userId);

  const allowedUpdates = [
    'farmName',
    'contactName',
    'phone',
    'description',
    'email',
    'farmAddress',
  ];

  allowedUpdates.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      profile[field] = updates[field];
    }
  });

  await profile.save();
  return profile;
}

module.exports = {
  getSellerProfile,
  updateSellerProfile,
};
