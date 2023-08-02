const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/new', messageController.new_get);

router.post('/new', messageController.new_post);

module.exports = router;
