const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.sign_up_get = (_req, res) => {
  res.render('signup_form', { title: 'Sign Up' });
};

exports.sign_up_post = [
  // Validate and sanitize fields.
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.'),
  body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.'),
  body('username', 'Invalid username').trim().isLength({ min: 1 }).escape(),
  body('password', 'Invalid password').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      bcrypt.hash(req.body.password, 10, async (_err, hashedPassword) => {
        // Create User object with escaped and trimmed data
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword
        });

        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          res.render('signup_form', {
            title: 'Sign Up',
            user: user,
            errors: errors.array()
          });
          return;
        } else {
          // Data from form is valid.

          // Save user.
          await user.save();
          // Redirect to home page.
          res.redirect('/');
        }
      });
    } catch (err) {
      return next(err);
    }
  })
];

exports.log_in_get = (_req, res) => {
  res.render('login_form', { title: 'Log In' });
};

exports.log_in_post = [
  // Validate and sanitize fields.
  body('username', 'Invalid username').trim().isLength({ min: 1 }).escape(),
  body('password', 'Invalid password').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('login_form', {
          title: 'Log In',
          errors: errors.array()
        });
        return;
      } else {
        // Data from form is valid.

        // Log the user in.
        passport.authenticate('local', {
          successRedirect: '/',
          failureRedirect: '/'
        })(req, res, next);
      }
    } catch (err) {
      return next(err);
    }
  })
];

exports.log_out_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.upgrade_get = (_req, res) => {
  res.render('upgrade_form', { title: 'Upgrade Membership' });
};

exports.upgrade_post = [
  // Validate and sanitize fields.
  body('secret', 'Invalid').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('upgrade_form', {
          title: 'Upgrade Membership',
          errors: errors.array()
        });
        return;
      } else if (req.body.secret !== process.env.CLUB_PASSCODE) {
        res.render('upgrade_form', {
          title: 'Upgrade Membership',
          errors: [{ msg: 'Incorrect passcode, try again' }]
        });
        return;
      } else {
        // User entered correct passcode to upgrade membership
        await User.findByIdAndUpdate(req.user._id, {
          membership: 'premium'
        });
        res.redirect('/');
      }
    } catch (err) {
      return next(err);
    }
  })
];

exports.admin_get = (_req, res) => {
  res.render('admin_form', { title: 'Become an Administrator' });
};

exports.admin_post = [
  // Validate and sanitize fields.
  body('admin', 'Invalid').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('admin_form', {
          title: 'Become an Administrator',
          errors: errors.array()
        });
        return;
      } else if (req.body.admin !== process.env.ADMIN_PASSCODE) {
        res.render('admin_form', {
          title: 'Become an Administrator',
          errors: [{ msg: 'Incorrect passcode, try again' }]
        });
        return;
      } else {
        // User entered correct passcode to upgrade membership
        await User.findByIdAndUpdate(req.user._id, {
          administrator: true
        });
        res.redirect('/');
      }
    } catch (err) {
      return next(err);
    }
  })
];
