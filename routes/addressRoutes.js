const express = require('express');
const addressController = require('../controllers/addressController');

const router = express.Router();

router
  .route('/')
  .get(addressController.getAllAddess)
  .post(addressController.createAddress);

router
  .route('/:id')
  .get(addressController.getAddress)
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

router.route('/locality').post(addressController.getLocality);

module.exports = router;
