const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.get('/', async function (req, res) {
  const messages = await Message.find({}).populate('author').sort({ timestamp: 'desc' });

  res.render('index', {
    title: 'Members Only',
    user: req.user,
    messages: messages
  });
});

module.exports = router;
