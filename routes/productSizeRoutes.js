const express = require('express');
const productSizeController = require('./../controllers/productSizeController');

const router = express.Router();

router
  .route('/')
  .get(productSizeController.getProductSize)
  .post(productSizeController.createProductSize);

router
  .route('/:id')
  .patch(productSizeController.updateProductSize)
  .delete(productSizeController.deleteProductSize);

module.exports = router;
