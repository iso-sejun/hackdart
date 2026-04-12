const mongoose = require('mongoose');

const addressSnapshotSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true, required: true },
    line2: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    postalCode: { type: String, trim: true, required: true },
    country: { type: String, trim: true, default: 'US', required: true },
  },
  { _id: false }
);

const foodBankSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    address: { type: addressSnapshotSchema, required: true },
  },
  { _id: false }
);

const orderGroupItemSchema = new mongoose.Schema(
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
    productNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    imageSnapshot: {
      type: String,
      required: true,
      trim: true,
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
    unitPrice: {
      type: Number,
      required: true,
      min: 0.01,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { _id: false }
);

const orderGroupSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'pending_payment',
        'confirmed',
        'shipped',
        'ready_for_pickup',
        'picked_up',
        'cancelled',
        'payment_failed',
      ],
      default: 'pending_payment',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'processing',
    },
    fulfillmentStatus: {
      type: String,
      enum: ['pending', 'batched', 'shipped', 'ready_for_pickup', 'completed'],
      default: 'pending',
    },
    pickupAddressSnapshot: {
      type: addressSnapshotSchema,
      required: true,
    },
    selectedFoodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodBank',
      required: true,
      index: true,
    },
    selectedFoodBankSnapshot: {
      type: foodBankSnapshotSchema,
      required: true,
    },
    itemsSnapshot: {
      type: [orderGroupItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentProcessingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0.01,
    },
    stripeCheckoutSessionId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

orderGroupSchema.index({ buyerId: 1, createdAt: -1 });

module.exports = mongoose.models.OrderGroup || mongoose.model('OrderGroup', orderGroupSchema);
