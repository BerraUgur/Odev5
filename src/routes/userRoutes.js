const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middleware/auth');

// Kullanıcı profili görüntüleme
router.get('/profile', verifyAccessToken, userController.getUserProfile);

// Kullanıcı profili güncelleme
router.put('/profile', verifyAccessToken, userController.updateUserProfile);

// Şifre güncelleme
router.put('/password', verifyAccessToken, userController.updatePassword);

module.exports = router;