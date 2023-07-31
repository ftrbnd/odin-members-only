const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Members Only',
    user: req.user
  });
});

module.exports = router;
