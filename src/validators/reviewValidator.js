const { body } = require('express-validator');

// Validation rules for adding a review
const addReviewValidationRules = [
  body('bookId').notEmpty().withMessage('Book ID is required.'),
  body('reviewText').notEmpty().withMessage('Review text is required.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.')
];

module.exports = { addReviewValidationRules };