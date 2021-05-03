const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFearures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all products - with filter,sort and pagination
 * eg. /products?_id='1212'&name='test'
 */
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

/** Get a perticular product by its ID */
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**Create a new product */
exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

/**Update a perticular product by its Id */
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) {
    return next(new AppError('No product found with that Id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**Delete a perticular product by Id */
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that Id', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
