const axios = require('axios');
const Address = require('../models/addressModel');
const APIFeatures = require('../utils/apiFearures');
const catchAsync = require('../utils/catchAsync');

// Returns all address
// Add filter to get address by UserId
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

// Returns a selcted address based on address id
exports.getAddress = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      address
    }
  });
});

// Create address
exports.createAddress = catchAsync(async (req, res, next) => {
  const newAddress = await Address.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      address: newAddress
    }
  });
});

// Update a address based on it's ID
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

// Get locality based on zipcode given
exports.getLocality = catchAsync(async (req, res) => {
  const { pincode } = req.body;
  const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);

  if (response.data[0].Status === 'Success') {
    const postOfficeData = response.data[0].PostOffice;
    const locality = [];
    postOfficeData.forEach(postOffice => {
      locality.push(postOffice.Name);
    });
    const district = postOfficeData[0].District;
    const state = postOfficeData[0].State;
    const country = postOfficeData[0].Country;
    const region = postOfficeData[0].Region;
    const zipCode = postOfficeData[0].Pincode;
    res.status(200).json({
      status: 'success',
      data: {
        locality,
        district,
        state,
        country,
        region,
        pincode: zipCode
      }
    });
  } else {
    const data = response.data[0].Message;
    res.status(200).json({
      status: 'error',
      data
    }); // Need to create custome error for this
  }
});
