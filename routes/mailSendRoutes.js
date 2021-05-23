const express = require('express');

const router = express.Router();
const mailController = require('../controllers/mailController');

router.route('/sendMail').post(mailController.sendMail);

module.exports = router;
