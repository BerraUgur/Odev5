const { body } = require('express-validator');

// Validation rules for borrowing a book
const borrowBookValidationRules = [
  body('bookId').notEmpty().withMessage('Book ID is required.')
];

module.exports = { borrowBookValidationRules };