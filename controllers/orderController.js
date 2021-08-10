const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find();

  res.status(200).json({
    status: 'success',
    results: order.length,
    data: {
      order
    }
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.orderId) filter = { order: req.params.orderId };
  const order = await Order.find(filter);

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await Order.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder
    }
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.deleteOrder = factory.deleteOne(Order);
