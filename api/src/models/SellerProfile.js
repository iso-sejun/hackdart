const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true, default: '' },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'US' },
  },
  { _id: false }
);

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: undefined,
    },
  },
  { _id: false }
);

const sellerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    farmName: {
      type: String,
      required: true,
      trim: true,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    farmAddress: {
      type: addressSchema,
      required: true,
    },
    farmGeo: {
      type: pointSchema,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    foodSafetyAttested: {
      type: Boolean,
      required: true,
      validate: {
        validator: Boolean,
        message: 'Food safety attestation is required',
      },
    },
    foodSafetyAttestedAt: {
      type: Date,
      required: true,
    },
    foodSafetyTermsVersion: {
      type: String,
      required: true,
      trim: true,
    },
    stripeAccountId: {
      type: String,
      default: null,
    },
    stripeOnboardingStatus: {
      type: String,
      enum: ['not_started', 'pending', 'completed', 'restricted'],
      default: 'not_started',
    },
    payoutsEnabled: {
      type: Boolean,
      default: false,
    },
    chargesEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.SellerProfile || mongoose.model('SellerProfile', sellerProfileSchema);
