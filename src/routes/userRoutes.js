const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middleware/auth');

// Routes for user management
// Get user profile
router.get('/profile', verifyAccessToken, userController.getUserProfile);

// Update user profile
router.put('/profile', verifyAccessToken, userController.updateUserProfile);

// Update user password
router.put('/password', verifyAccessToken, userController.updatePassword);

module.exports = router;