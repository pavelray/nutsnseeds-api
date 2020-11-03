const Address = require('../models/addressModel');
const APIFeatures = require('../utils/apiFearures');

exports.getAllAddess = async (req, res) => {
  try {
    console.log(req.query);
    const features = new APIFeatures(Address.find(), req.query).filter().limitFields();
    const address = await await features.query;

    res.status(200).json({
      status: 'success',
      results: address.length,
      data: {
        address
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        address
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const newAddress = await Address.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        address: newAddress
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
