const mongoose = require('mongoose');

const productSizeSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Product size must belong to a Product']
    },
    size: [Number],
    unit: {
      type: String,
      required: [true, 'A product must have a size unit'],
      enum: {
        values: ['L', 'ml', 'g', 'kg'],
        message: 'Unit values is either: L, ml, g, kg'
      }
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const ProductSize = mongoose.model('ProductSize', productSizeSchema);

module.exports = ProductSize;
