const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyRefreshToken } = require("../middleware/auth");
const { registerValidationRules, loginValidationRules } = require('../validators/authValidator');
const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes for user authentication
router.post("/register", registerValidationRules, validate, authController.registerUser); // Register a new user
router.post("/login", loginValidationRules, validate, authController.loginUser); // Login a user
router.post("/refresh-token", verifyRefreshToken, authController.refreshTokens); // Refresh tokens
router.post("/logout", authController.logout); // Logout a user

module.exports = router;