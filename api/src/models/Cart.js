const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    imageSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    unitPriceSnapshot: {
      type: Number,
      required: true,
      min: 0.01,
    },
    unit: {
      type: String,
      enum: ['lb', 'bunch', 'item', 'basket'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { timestamps: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true },
    line2: { type: String, trim: true, default: '' },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'US' },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    selectedFoodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodBank',
      default: null,
    },
    pickupAddressSnapshot: {
      type: addressSnapshotSchema,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
