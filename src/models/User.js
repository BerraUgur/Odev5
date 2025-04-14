const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // Kullanıcı adı
  username: { type: String, required: true, unique: true },
  // Kullanıcı email adresi
  email: { type: String, required: true, unique: true },
  // Kullanıcı şifresi
  password: { type: String, required: true },
  // Kullanıcı rolü (reader veya admin)
  role: { type: String, enum: ['reader', 'admin'], default: 'reader' },
}, { timestamps: true });

// Şifreyi hashleme işlemi
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Şifre doğrulama fonksiyonu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);