const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyAccessToken } = require('../middleware/auth');

// Kitap değerlendirmesi ekleme
router.post('/', verifyAccessToken, reviewController.addReview);

// Değerlendirme silme
router.delete('/:reviewId', verifyAccessToken, reviewController.deleteReview);

// Değerlendirme listeleme
router.get('/', reviewController.getReviews);

module.exports = router;