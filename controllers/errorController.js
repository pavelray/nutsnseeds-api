const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    name: err.name,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Return only trusted errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //Showing a generic msg for all other errors in prod
    // console.log('Error:', err);
    // res.status(500).json({
    //   status: 'error',
    //   message: 'Something went wrong !'
    // });

    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = err => {
  const message = `Duplicate filed value "${err.keyValue.name}". Please use different value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errorMsg = Object.values(err.errors)
    .map(e => e.message)
    .join('. ');

  const message = `Invalid input data: ${errorMsg}.`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  const message = `Invalid token. Please login again.`;
  return new AppError(message, 401);
};

const handleTokenExpiredError = () => {
  const message = `Token expired. Please login again.`;
  return new AppError(message, 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.staus = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrorProd(error, res);
  }
};
