const express = require('express');
const productSizeController = require('./../controllers/productSizeController');

const router = express.Router();

router.route('/').post(productSizeController.createProductSize);

router
  .route('/:id')
  .get(productSizeController.getProductSize)
  .patch(productSizeController.updateProductSize)
  .delete(productSizeController.deleteProductSize);

module.exports = router;
