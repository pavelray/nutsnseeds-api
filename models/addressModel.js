const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A address must have a name'],
    trim: true,
    maxlength: [20, 'A name must have less or equal then 20 characters'],
    minlength: [5, 'A name must have more or equal then 5 characters']
  },
  phoneNumber: {
    type: Number,
    required: [true, 'A address must have a phone number'],
    trim: true,
    maxlength: [10, 'A phone number must be of 10 digits'],
    minlength: [10, 'A phone number must be of 10 digits']
  },
  addressLine1: {
    type: String,
    trim: true,
    required: [true, 'A address must have a address line 1'],
    maxlength: [40, 'A address must have less or equal then 40 characters'],
    minlength: [10, 'A address must have more or equal then 10 characters']
  },
  addressLine2: {
    type: String,
    trim: true,
    maxlength: [40, 'A address must have less or equal then 40 characters'],
    minlength: [10, 'A address must have more or equal then 10 characters']
  },
  city: {
    type: String,
    trim: true,
    required: [true, 'A address must have a city'],
    maxlength: [10, 'A city must have less or equal then 10 characters'],
    minlength: [3, 'A city must have more or equal then 3 characters']
  },
  state: {
    type: String,
    trim: true,
    required: [true, 'A address must have a state'],
    maxlength: [10, 'A state must have less or equal then 10 characters'],
    minlength: [3, 'A state must have more or equal then 3 characters']
  },
  pincode: {
    type: String,
    trim: true,
    required: [true, 'A address must have a pincode'],
    maxlength: [10, 'A state must have less or equal then 10 characters'],
    minlength: [3, 'A state must have more or equal then 3 characters']
  },
  country: {
    type: String,
    trim: true,
    default: 'India'
  },
  userId: {
    type: String,
    required: [true, 'A address must have a userId']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
