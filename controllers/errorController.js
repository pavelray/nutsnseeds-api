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
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong !'
    });
  }
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.staus = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
  }
};
