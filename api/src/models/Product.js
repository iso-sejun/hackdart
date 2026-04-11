const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'produce',
      index: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    unit: {
      type: String,
      enum: ['lb', 'bunch', 'item', 'basket'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    quantityAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    quantityReserved: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumOrderQty: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'sold_out', 'archived'],
      default: 'active',
      index: true,
    },
    harvestDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ sellerId: 1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
