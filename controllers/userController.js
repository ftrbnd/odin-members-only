const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.sign_up_get = (_req, res) => {
  res.render("signup_form", { title: "Sign Up" });
};

exports.sign_up_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified."),
  body("username", "Invalid username")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Invalid password")
    .trim()
    .isLength({ min: 1 })
    .escape(),

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
                res.render("signup_form", {
                    title: "Sign Up",
                    user: user,
                    errors: errors.array(),
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
        } catch(err) {
            return next(err);
        };
  }),
];