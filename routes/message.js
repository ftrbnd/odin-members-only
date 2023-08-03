const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/new', messageController.new_get);

router.post('/new', messageController.new_post);

router.get('/:id/delete', messageController.delete_get);

router.post('/:id/delete', messageController.delete_post);

module.exports = router;
