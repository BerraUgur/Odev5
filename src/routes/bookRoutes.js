const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyAccessToken, authorizeRoles } = require('../middleware/auth');
const { addBookValidationRules, updateBookValidationRules } = require('../validators/bookValidator');
const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes for book management
// List all books (with filtering and sorting)
router.get('/', bookController.getAllBooks);

// Add a new book (admin only)
router.post('/', verifyAccessToken, authorizeRoles('admin'), addBookValidationRules, validate, bookController.createBook);

// Update book details (admin only)
router.put('/:id', verifyAccessToken, authorizeRoles('admin'), updateBookValidationRules, validate, bookController.updateBook);

// Delete a book (admin only)
router.delete('/:id', verifyAccessToken, authorizeRoles('admin'), bookController.deleteBook);

module.exports = router;