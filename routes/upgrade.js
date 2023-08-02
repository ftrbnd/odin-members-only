const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.upgrade_get);

router.post('/', userController.upgrade_post);

module.exports = router;
