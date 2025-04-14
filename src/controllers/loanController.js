const Loan = require('../models/Loan');
const Book = require('../models/Book');

// Kitap ödünç alma işlemi
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Kitabın mevcut olup olmadığını kontrol et
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ message: 'Kitap mevcut değil.' });
    }

    // Ödünç alma işlemini oluştur
    const loan = new Loan({
      user: req.user.id,
      book: bookId,
    });

    // Kitap durumunu güncelle ve kaydet
    book.available = false;
    await book.save();
    await loan.save();

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Kitap ödünç alınırken bir hata oluştu.' });
  }
};

// Kullanıcının ödünç aldığı kitapları listeleme
const getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).populate('book');
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Ödünç alınan kitaplar listelenirken bir hata oluştu.' });
  }
};

// Kitap iade işlemi
const returnBook = async (req, res) => {
  try {
    const { loanId } = req.params;

    // Ödünç işlemini kontrol et
    const loan = await Loan.findById(loanId).populate('book');
    if (!loan || loan.isReturned) {
      return res.status(400).json({ message: 'Geçersiz ödünç işlemi.' });
    }

    // Ödünç durumunu güncelle ve kaydet
    loan.isReturned = true;
    loan.returnDate = new Date();
    loan.book.available = true;

    await loan.book.save();
    await loan.save();

    res.status(200).json({ message: 'Kitap başarıyla iade edildi.' });
  } catch (error) {
    res.status(500).json({ message: 'Kitap iade edilirken bir hata oluştu.' });
  }
};

module.exports = {
  borrowBook,
  getUserLoans,
  returnBook,
};