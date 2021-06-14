const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(authController.protectedRoute, authController.restrictTo('admin'), productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(authController.protectedRoute, authController.restrictTo('admin'), productController.updateProduct)
  .delete(authController.protectedRoute, authController.restrictTo('admin'), productController.deleteProduct);

module.exports = router;
