const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const productSize = require('./routes/productSizeRoutes');
const userRouter = require('./routes/userRoutes');
const addressRouter = require('./routes/addressRouter');


const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/product-size', productSize);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/address', addressRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server.`, 404);
  next(err); // If we pass any value to next middleware then express takes that as an error
});

app.use(globalErrorHandler);

module.exports = app;
