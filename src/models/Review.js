const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Değerlendirme yapan kullanıcı
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Değerlendirilen kitap
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  // Değerlendirme metni
  reviewText: { type: String, required: true },
  // Değerlendirme puanı (1-5 arası)
  rating: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);