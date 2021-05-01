const Address = require('../models/addressModel');
const APIFeatures = require('../utils/apiFearures');
const catchAsync = require('../utils/catchAsync');

exports.getAllAddess = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Address.find(), req.query).filter().limitFields();
  const address = await await features.query;

  res.status(200).json({
    status: 'success',
    results: address.length,
    data: {
      address
    }
  });
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      address
    }
  });
});

exports.createAddress = catchAsync(async (req, res, next) => {
  const newAddress = await Address.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      address: newAddress
    }
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      address
    }
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  await Address.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});
