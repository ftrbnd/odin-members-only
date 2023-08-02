const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.log_in_get);

router.post('/login', userController.log_in_post);

router.get('/logout', userController.log_out_get);

router.get('/signup', userController.sign_up_get);

router.post('/signup', userController.sign_up_post);

router.get('/upgrade', userController.upgrade_get);

router.post('/upgrade', userController.upgrade_post);

module.exports = router;
