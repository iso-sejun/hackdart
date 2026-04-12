const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      enum: ['lb', 'bunch', 'item', 'basket'],
      required: true,
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

const orderSchema = new mongoose.Schema(
  {
    orderGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderGroup',
      required: true,
      index: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    foodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodBank',
      required: true,
      index: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FulfillmentBatch',
      default: null,
      index: true,
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
    items: {
      type: [orderItemSchema],
      default: [],
    },
    sellerSubtotal: {
      type: Number,
      required: true,
      min: 0.01,
    },
    buyerTotal: {
      type: Number,
      required: true,
      min: 0.01,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    readyForPickupAt: {
      type: Date,
      default: null,
    },
    pickedUpAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ sellerId: 1, createdAt: -1 });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
