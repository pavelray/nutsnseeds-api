const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(authController.protectedRoute, authController.restrictTo('user'), orderController.createOrder);

router
  .route('/:id')
  .delete(authController.protectedRoute, authController.restrictTo('admin'), orderController.deleteOrder);

module.exports = router;
