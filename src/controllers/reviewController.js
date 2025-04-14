const Review = require('../models/Review');

// Kitap değerlendirmesi ekleme işlemi
const addReview = async (req, res) => {
  try {
    const { bookId, reviewText, rating } = req.body;

    // Yeni değerlendirme oluştur
    const review = new Review({
      user: req.user.id,
      book: bookId,
      reviewText,
      rating,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Değerlendirme eklenirken bir hata oluştu.' });
  }
};

// Değerlendirme silme işlemi
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Değerlendirme kontrolü
    const review = await Review.findById(reviewId);
    if (!review || review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bu değerlendirmeyi silme yetkiniz yok.' });
    }

    await review.remove();
    res.status(200).json({ message: 'Değerlendirme başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Değerlendirme silinirken bir hata oluştu.' });
  }
};

// Değerlendirme listeleme işlemi
const getReviews = async (req, res) => {
  try {
    const { bookId } = req.query;

    // Kitaba göre değerlendirme sorgusu
    const query = bookId ? { book: bookId } : {};
    const reviews = await Review.find(query).populate('user', 'username');

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Değerlendirmeler alınırken bir hata oluştu.' });
  }
};

module.exports = {
  addReview,
  deleteReview,
  getReviews,
};