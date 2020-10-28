const ProductSize = require('../models/productSizeModel');

exports.getProductSize = async (req, res) => {
  try {
    const size = await ProductSize.find({ productId: req.params.id });

    res.status(200).json({
      status: 'success',
      data: {
        size
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createProductSize = async (req, res) => {
  try {
    const newSize = await ProductSize.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        size: newSize
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateProductSize = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteProductSize = async (req, res) => {
  try {
    await ProductSize.findByIdAndDelete(req.params.id);

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
