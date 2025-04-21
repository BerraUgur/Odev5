const { body } = require('express-validator');

// Validation rules for adding a new book
const addBookValidationRules = [
  body('title').notEmpty().withMessage('Title is required.'),
  body('author').notEmpty().withMessage('Author is required.'),
  body('category').notEmpty().withMessage('Category is required.')
];

// Validation rules for updating a book
const updateBookValidationRules = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty if provided.'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty if provided.'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty if provided.')
];

module.exports = { addBookValidationRules, updateBookValidationRules };