const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const productSize = require('./routes/productSizeRoutes');
const userRouter = require('./routes/userRoutes');
const addressRouter = require('./routes/addressRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// #CLOBAL MIDDLEWARES

//Set Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//CORS
app.use(cors());

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// ##TODO need to check and whitelist params
// Prevent parameter pollution.
// app.use(
//   hpp({
//     whitelist: ['price']
//   })
// );

app.use(compression);

//Serving Static files
app.use(express.static(`${__dirname}/public`));

// Example Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//  #ROUTES
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/product-size', productSize);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/reviews', reviewRouter);

// Unhandled routes
app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server.`, 404);
  next(err); // If we pass any value to next middleware then express takes that as an error
});

app.use(globalErrorHandler);

module.exports = app;
