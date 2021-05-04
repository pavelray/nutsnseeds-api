const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name of the user']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  role: {
    type: String,
    enum: ['user', 'manager', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password is required'],
    validate: function(el) {
      return el === this.password;
    },
    message: 'Password and Confirm Password should match'
  },
  passwordUpdated: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

// This is an instance method. This will be availabe for all the instances of userModule
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimeStamp) {
  if (this.passwordUpdated) {
    const changedTimeStamp = parseInt(this.passwordUpdated.getTime() / 1000, 10);
    return JWTTimeStamp < changedTimeStamp;
  }
  // False means password NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
