const Razorpay = require('razorpay');
const catchAsync = require('../utils/catchAsync');

const CURRENCY = 'INR'; // This need to move to .ENV file.

const razorpay = new Razorpay({
  key_id: 'rzp_test_uY4J3ogr0nXfYm', // this need to move to .ENV file.
  key_secret: 'oDmk4DFl2VSjtqBFt0p8YlW3'
});

// This method will create a payment in Razor Pay account.
exports.createPayment = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line camelcase
  const payment_capture = 1;
  const amount = req.body.amount * 100;
  const opions = {
    amount: amount.toString(),
    currency: CURRENCY,
    receipt: Math.random(),
    payment_capture
  };
  const response = await razorpay.orders.create(opions);

  res.status(200).json({
    status: 'success',
    data: {
      id: response.id,
      currency: response.currency,
      ammount: response.ammount
    }
  });
});

// This method is required to verify the payement and will execute after the createPayment
exports.validatePayment = catchAsync(async (req, res) => {
  // eslint-disable-next-line global-require
  const crypto = require('crypto');

  const shasum = crypto.createHmac('sha256', 'oDmk4DFl2VSjtqBFt0p8YlW3');
  shasum.update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`, 'oDmk4DFl2VSjtqBFt0p8YlW3');
  const digest = shasum.digest('hex');

  // console.log(digest, req.body.razorpay_signature)

  if (digest === req.body.razorpay_signature) {
    res.status(200).json({
      success: true
    });
  } else {
    res.status(200).json({
      success: false
    });
  }
});
