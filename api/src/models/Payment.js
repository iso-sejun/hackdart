const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['processing', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'processing',
      index: true,
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
    stripeChargeId: {
      type: String,
      trim: true,
      default: null,
    },
    webhookEvents: {
      type: [webhookEventSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
