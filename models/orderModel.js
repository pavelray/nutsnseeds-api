const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: [true, 'An Order must have total cost']
    },
    base: {
      type: Number,
      required: [true, 'An Order must have base cost']
    },
    discount: Number,
    tax: Number,
    status: {
      type: String,
      required: [true, 'A order must have status'],
      default: 'Pending',
      enum: {
        values: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
        message: 'Order Status values is either: Pending, Confirmed, Completed, Cancelled, Rejected'
      }
    },
    shippingAddress: String,
    billingAddress: String,
    paymentId: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    product: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    user: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Document Middleware

orderSchema.virtual('product', {
  ref: 'Product',
  foreignField: 'product',
  localField: '_id'
});

orderSchema.virtual('user', {
  ref: 'User',
  foreignField: 'user',
  localField: '_id'
});

// This is query middleware

// Returns only active product which are available for sell
// productSchema.pre(/^find/, function(next) {
//   this.find({ isOutOfStock: { $ne: true } });
//   next();
// });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
