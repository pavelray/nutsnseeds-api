const express = require('express');

const router = express.Router();
const paymentContorller = require('../controllers/paymentController');

router.route('/razorpayPayment').post(paymentContorller.createPayment);
router.route('/validatePayment').post(paymentContorller.validatePayment);

module.exports = router;
