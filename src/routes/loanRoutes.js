const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { verifyAccessToken } = require('../middleware/auth');
const { borrowBookValidationRules } = require('../validators/loanValidator');
const { validationResult } = require('express-validator');

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