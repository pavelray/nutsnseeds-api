const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A product name must have less or equal then 40 characters'],
    minlength: [10, 'A product name must have more or equal then 10 characters']
  },
  slug: String,
  price: {
    type: [Number],
    required: [true, 'A product must have a price']
  },
  size: {
    type: [String],
    required: [true, 'A product must have a price']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A product must have a description']
  },
  imageUrl: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  isOutOfStock: {
    type: Boolean,
    default: false
  },
  categoryId: {
    type: Number,
    required: [true, 'A product must have a category']
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
