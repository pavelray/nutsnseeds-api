const ProductSize = require('../models/productSizeModel');
const catchAsync = require('../utils/catchAsync');

exports.getProductSize = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.productId) filter = { product: req.params.productId };
  const size = await ProductSize.find(filter);

  res.status(200).json({
    status: 'success',
    data: {
      size
    }
  });
});

exports.createProductSize = catchAsync(async (req, res, next) => {
  const newSize = await ProductSize.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      size: newSize
    }
  });
});

exports.updateProductSize = catchAsync(async (req, res, next) => {
  const size = await ProductSize.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      size
    }
  });
});

exports.deleteProductSize = catchAsync(async (req, res, next) => {
  await ProductSize.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});
