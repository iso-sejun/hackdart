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

const buyerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    defaultAddress: {
      type: addressSchema,
      required: true,
    },
    defaultGeo: {
      type: pointSchema,
      default: null,
    },
    pickupRadiusMiles: {
      type: Number,
      required: true,
      min: 1,
      max: 25,
      default: 5,
    },
    householdSize: {
      type: Number,
      min: 1,
      default: null,
    },
    eligibilityMode: {
      type: String,
      enum: ['self_attested', 'partner_verified', 'invite_code'],
      default: 'self_attested',
    },
    eligibilityStatus: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
    },
    savedFoodBankIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodBank',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.BuyerProfile || mongoose.model('BuyerProfile', buyerProfileSchema);
