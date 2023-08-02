const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.log_out_get);

module.exports = router;