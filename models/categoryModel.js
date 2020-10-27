const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A product name must have less or equal then 40 characters'],
    minlength: [10, 'A product name must have more or equal then 10 characters']
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  isOutOfStock: {
    type: Boolean,
    default: false
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
