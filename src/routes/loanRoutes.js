const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { verifyAccessToken } = require('../middleware/auth');

// Kitap ödünç alma
router.post('/borrow', verifyAccessToken, loanController.borrowBook);

// Kullanıcının ödünç aldığı kitapları listeleme
router.get('/my-loans', verifyAccessToken, loanController.getUserLoans);

// Kitap iade işlemi
router.put('/return/:loanId', verifyAccessToken, loanController.returnBook);

module.exports = router;