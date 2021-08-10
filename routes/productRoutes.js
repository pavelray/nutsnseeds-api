const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
const productSizeRouter = require('../routes/productSizeRoutes');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(productController.getAllProducts)
  .post(authController.protectedRoute, authController.restrictTo('admin'), productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protectedRoute,
    authController.restrictTo('admin'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(authController.protectedRoute, authController.restrictTo('admin'), productController.deleteProduct);

router.use('/:productId/sizes', productSizeRouter);
router.use('/:productId/reviews', reviewRouter);

module.exports = router;
