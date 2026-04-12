const mongoose = require('mongoose');

const aggregatedItemSchema = new mongoose.Schema(
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
    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      enum: ['lb', 'bunch', 'item', 'basket'],
      required: true,
    },
  },
  { _id: false }
);

const fulfillmentBatchSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ['ready_to_ship', 'shipped', 'ready_for_pickup', 'completed', 'cancelled'],
      default: 'ready_to_ship',
      index: true,
    },
    orderIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
      },
    ],
    buyerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    aggregatedItems: {
      type: [aggregatedItemSchema],
      default: [],
    },
    manifestVersion: {
      type: Number,
      default: 1,
      min: 1,
    },
    manifestSentAt: {
      type: Date,
      default: null,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    readyForPickupAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

fulfillmentBatchSchema.index({ sellerId: 1, foodBankId: 1, status: 1, createdAt: -1 });

module.exports =
  mongoose.models.FulfillmentBatch || mongoose.model('FulfillmentBatch', fulfillmentBatchSchema);
