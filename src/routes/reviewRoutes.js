const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyAccessToken } = require('../middleware/auth');
const { addReviewValidationRules } = require('../validators/reviewValidator');
const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes for review management
// Add a book review
router.post('/', verifyAccessToken, addReviewValidationRules, validate, reviewController.addReview);

// Delete a review
router.delete('/:reviewId', verifyAccessToken, reviewController.deleteReview);

// List reviews
router.get('/', reviewController.getReviews);

module.exports = router;