const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  console.log(new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000));
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // Remove the password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.password
  });
  const url = `${req.protocol}://${req.get('host')}/shop`;

  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new AppError('Please provide email and password for login', 400));
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password'), 401);
  }
  createSendToken(user, 200, res);
});

exports.protectedRoute = catchAsync(async (req, res, next) => {
  // Get token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not authorized. Please login to access', 401));
  }
  //Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if the user still exsists
  const requestedUser = await User.findById(decoded.id);
  if (!requestedUser) {
    return next(new AppError('The user no longer exsists', 401));
  }

  // Check if user changes the password after the token is generated
  if (requestedUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User updated the password recently. Please login again', 401));
  }

  req.user = requestedUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You dont have permission to preform this operation', 401));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending mail. Please try again later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hasedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({ passwordResetToken: hasedToken, passwordResetExpires: { $gt: Date.now() } });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your password is worng', 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  createSendToken(user, 200, res);
});
