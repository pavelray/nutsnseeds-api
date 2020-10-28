const mongoose = require('mongoose');

const ratingsAndReviewsSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Rating and Review must have a Product Id']
  },
  userId: {
    type: String,
    required: [true, 'Rating and Review must have a User Id']
  },
  review: {
    type: String,
    trim: true,
    maxlength: [400, 'A Review name must have less or equal then 400 characters'],
    minlength: [100, 'A Review name must have more or equal then 100 characters']
  },
  rating: {
    type: Number,
    default: 1,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  isVisable: {
    type: Boolean,
    default: true
  }
});

const RatingsAndReviews = mongoose.model('RatingsAndReviews', ratingsAndReviewsSchema);

module.exports = RatingsAndReviews;
