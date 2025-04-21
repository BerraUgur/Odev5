const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyAccessToken } = require('../middleware/auth');
const { addReviewValidationRules } = require('../validators/reviewValidator');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API endpoints for review management
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Add a book review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               reviewText:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: List reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: string
 *         description: Filter reviews by book ID
 *     responses:
 *       200:
 *         description: List of reviews
 *       500:
 *         description: Server error
 */

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