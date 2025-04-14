const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // Kitap başlığı
  title: { type: String, required: true },
  // Kitap yazarı
  author: { type: String, required: true },
  // Kitap kategorisi
  category: { type: String, required: true },
  // Kitabın mevcut olup olmadığı bilgisi
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
