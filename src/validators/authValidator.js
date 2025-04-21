const { body } = require('express-validator');

// Validation rules for user registration
const registerValidationRules = [
  body('username').notEmpty().withMessage('Username is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];

// Validation rules for user login
const loginValidationRules = [
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

module.exports = { registerValidationRules, loginValidationRules };