const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.log_in_get);

router.post('/', userController.log_in_post);

module.exports = router;
