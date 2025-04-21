const User = require('../models/User');
const bcrypt = require('bcrypt');

// Viewing user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Updating user profile
const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// Updating password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mevcut ve yeni şifre gereklidir.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updatePassword,
};