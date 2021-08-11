const multer = require('multer');
const sharp = require('sharp');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFearures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProductImages = upload.array('images', 4);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, index) => {
      const fileName = `product-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(500, 500)
        .withMetadata()
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${fileName}`);

      req.body.images.push(fileName);
    })
  );

  next();
});

exports.getCategoryProducts = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  const products = await Product.find(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

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
  const product = await Product.findById(req.params.id)
    .populate('review')
    .populate('size');
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
  await Category.findByIdAndUpdate(req.body.category, { $inc: { totalProducts: 1 } }, { new: true });

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

exports.deleteProduct = factory.deleteOne(Product);
// /**Delete a perticular product by Id */
// exports.deleteProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndDelete(req.params.id);
//   if (!product) {
//     return next(new AppError('No product found with that Id', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });
