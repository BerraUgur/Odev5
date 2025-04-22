const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middleware/auth');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user management
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/users/favorites:
 *   post:
 *     summary: Add a book to favorites
 *     tags: [Users]
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
 *       200:
 *         description: Book added to favorites successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get all favorite books for a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Favorite books retrieved successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/favorites/{favoriteId}:
 *   delete:
 *     summary: Remove a book from favorites
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: favoriteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from favorites successfully
 *       404:
 *         description: Favorite not found
 */

// Routes for user management
// Get user profile
router.get('/profile', verifyAccessToken, userController.getUserProfile);

// Update user profile
router.put('/profile', verifyAccessToken, userController.updateUserProfile);

// Update user password
router.put('/password', verifyAccessToken, userController.updatePassword);

// Add a book to favorites
router.post('/favorites', verifyAccessToken, addFavorite);

// Get all favorite books for a user
router.get('/favorites', verifyAccessToken, getFavorites);

// Remove a book from favorites
router.delete('/favorites/:favoriteId', verifyAccessToken, removeFavorite);

module.exports = router;