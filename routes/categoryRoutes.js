const express = require('express');
const categoryController = require('./../controllers/categoryController');
const authController = require('../controllers/authController');
const productRouter = require('./../routes/productRoutes');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(authController.protectedRoute, authController.restrictTo('admin'), categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(
    authController.protectedRoute,
    authController.restrictTo('admin'),
    categoryController.uploadCategoryPhoto,
    categoryController.resizeCategoryPhoto,
    categoryController.updateCategory
  )
  .delete(authController.protectedRoute, authController.restrictTo('admin'), categoryController.deleteCategory);

router.use('/:id/product', productRouter);

module.exports = router;
