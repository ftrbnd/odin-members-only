const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Message = require('../models/Message');

exports.new_get = (_req, res) => {
  res.render('message_form', { title: 'New Message' });
};

exports.new_post = [
  // Validate and sanitize fields.
  body('title', 'Invalid title').trim().isLength({ min: 1 }).escape(),
  body('text', 'Invalid text').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      const message = new Message({
        title: req.body.title,
        text: req.body.text,
        timestamp: new Date(),
        author: res.locals.currentUser
      });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('message_form', {
          title: 'New Message',
          message: message,
          errors: errors.array()
        });
        return;
      } else {
        // Data from form is valid.
        // Post the message
        await message.save();
        res.redirect('/');
      }
    } catch (err) {
      return next(err);
    }
  })
];
