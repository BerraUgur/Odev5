const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyAccessToken, authorizeRoles } = require('../middleware/auth');

// Kitap listeleme (filtreleme ve sıralama dahil)
router.get('/', bookController.getAllBooks);

// Yeni kitap ekleme (sadece adminler)
router.post('/', verifyAccessToken, authorizeRoles('admin'), bookController.createBook);

// Kitap bilgilerini güncelleme (sadece adminler)
router.put('/:id', verifyAccessToken, authorizeRoles('admin'), bookController.updateBook);

// Kitap silme (sadece adminler)
router.delete('/:id', verifyAccessToken, authorizeRoles('admin'), bookController.deleteBook);

module.exports = router;