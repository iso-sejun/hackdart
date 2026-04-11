const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const BuyerProfile = require('../models/BuyerProfile');
const SellerProfile = require('../models/SellerProfile');

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

async function assertEmailAvailable(email) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error('An account already exists with this email');
    error.statusCode = 409;
    error.code = 'EMAIL_IN_USE';
    throw error;
  }
}

async function registerBuyer(payload) {
  await assertEmailAvailable(payload.email);

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    email: payload.email,
    passwordHash,
    role: 'buyer',
  });

  const buyerProfile = await BuyerProfile.create({
    userId: user._id,
    fullName: payload.fullName,
    phone: payload.phone,
    defaultAddress: payload.address,
    pickupRadiusMiles: payload.pickupRadiusMiles,
    eligibilityMode: payload.eligibilityMode || 'self_attested',
  });

  const token = createToken(user);

  return {
    token,
    user,
    profile: buyerProfile,
  };
}

async function registerSeller(payload) {
  await assertEmailAvailable(payload.email);

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    email: payload.email,
    passwordHash,
    role: 'seller',
  });

  const sellerProfile = await SellerProfile.create({
    userId: user._id,
    farmName: payload.farmName,
    contactName: payload.contactName,
    phone: payload.phone,
    email: payload.email,
    farmAddress: payload.farmAddress,
    foodSafetyAttested: payload.foodSafetyAttested,
    foodSafetyAttestedAt: new Date(),
    foodSafetyTermsVersion: payload.foodSafetyTermsVersion,
  });

  const token = createToken(user);

  return {
    token,
    user,
    profile: sellerProfile,
  };
}

async function login(payload) {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  let profile = null;
  if (user.role === 'buyer') {
    profile = await BuyerProfile.findOne({ userId: user._id });
  } else if (user.role === 'seller') {
    profile = await SellerProfile.findOne({ userId: user._id });
  }

  return {
    token: createToken(user),
    user,
    profile,
  };
}

async function getCurrentUser(auth) {
  const user = await User.findById(auth.sub).select('-passwordHash');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  let profile = null;
  if (user.role === 'buyer') {
    profile = await BuyerProfile.findOne({ userId: user._id });
  } else if (user.role === 'seller') {
    profile = await SellerProfile.findOne({ userId: user._id });
  }

  return { user, profile };
}

module.exports = {
  registerBuyer,
  registerSeller,
  login,
  getCurrentUser,
};
