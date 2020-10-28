const mongoose = require('mongoose');

const productSizeSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product Id is required to save a Product Size']
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
});

const ProductSize = mongoose.model('ProductSize', productSizeSchema);

module.exports = ProductSize;
