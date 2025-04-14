const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  // Ödünç alan kullanıcı
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Ödünç alınan kitap
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  // Ödünç alma tarihi
  loanDate: { type: Date, default: Date.now },
  // İade tarihi
  returnDate: { type: Date },
  // İade durumu
  isReturned: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);