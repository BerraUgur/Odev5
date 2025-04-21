const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { verifyAccessToken } = require('../middleware/auth');
const { borrowBookValidationRules } = require('../validators/loanValidator');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: API endpoints for loan management
 */

/**
 * @swagger
 * /api/loans/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Loans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/loans/my-loans:
 *   get:
 *     summary: List books borrowed by the user
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: List of borrowed books
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/loans/return/{loanId}:
 *   put:
 *     summary: Return a borrowed book
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Bad request
 */

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes for loan management
// Borrow a book
router.post('/borrow', verifyAccessToken, borrowBookValidationRules, validate, loanController.borrowBook);

// List books borrowed by the user
router.get('/my-loans', verifyAccessToken, loanController.getUserLoans);

// Return a book
router.put('/return/:loanId', verifyAccessToken, loanController.returnBook);

module.exports = router;