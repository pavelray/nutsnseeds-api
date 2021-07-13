const express = require('express');
const categoryController = require('./../controllers/categoryController');
const productRouter = require('./../routes/productRoutes');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.use('/:id/product', productRouter);

module.exports = router;
