const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A product name must have less or equal then 40 characters'],
      minlength: [10, 'A product name must have more or equal then 10 characters']
    },
    slug: String,
    basePrice: {
      type: Number,
      required: [true, 'A product must have a base price']
    },
    price: Number,
    description: {
      type: String,
      trim: true,
      required: [true, 'A product must have a description']
    },
    imageUrl: [String],
    discount: Number,
    showDiscount: {
      type: Boolean,
      default: false
    },
    featureProduct: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    isOutOfStock: {
      type: Boolean,
      default: false
    },
    category: [{ type: mongoose.Schema.ObjectId, ref: 'Category' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Document Middleware
// This middleware runs before .create() and .save() of any model
// This will not work for .insertMany()
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.virtual('review', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

// This is query middleware

// Returns only active product which are available for sell
// productSchema.pre(/^find/, function(next) {
//   this.find({ isOutOfStock: { $ne: true } });
//   next();
// });

productSchema.pre(/^find/, function(next) {
  this.populate({ path: 'category', select: '-__v' });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
