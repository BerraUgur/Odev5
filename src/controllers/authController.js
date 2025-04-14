// Kullanıcı kimlik doğrulama işlemleri için gerekli fonksiyonlar

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { accessToken, refreshToken } = require("../config/jwtConfig");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");

// Access ve refresh token oluşturma fonksiyonu
const generateTokens = (user) => {
  const accessTokenPayload = { id: user._id, email: user.email, role: user.role };
  const refreshTokenPayload = { id: user._id };

  return {
    accessToken: jwt.sign(accessTokenPayload, accessToken.secret, { expiresIn: accessToken.expiresIn }),
    refreshToken: jwt.sign(refreshTokenPayload, refreshToken.secret, { expiresIn: refreshToken.expiresIn }),
  };
};

// Kullanıcı kaydı
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role = "reader" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email adresi zaten kayıtlı." });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı kaydedilirken bir hata oluştu." });
  }
};

// Kullanıcı giriş işlemi
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre gereklidir." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Geçersiz email veya şifre." });
    }

    await RefreshToken.deleteMany({ userId: user._id });
    const tokens = generateTokens(user);

    await RefreshToken.create({ userId: user._id, token: tokens.refreshToken });

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userResponse } = user.toObject();
    res.status(200).json({ message: "Giriş başarılı!", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı girişinde bir hata oluştu." });
  }
};

// Token yenileme işlemi
const refreshTokens = async (req, res) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(400).json({ message: "Refresh token gereklidir." });
    }

    const storedToken = await RefreshToken.findOne({ token: oldRefreshToken });
    if (!storedToken) {
      return res.status(403).json({ message: "Geçersiz refresh token." });
    }

    const decoded = jwt.verify(oldRefreshToken, refreshToken.secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    await RefreshToken.deleteOne({ token: oldRefreshToken });
    const tokens = generateTokens(user);

    await RefreshToken.create({ userId: user._id, token: tokens.refreshToken });

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Tokenlar başarıyla yenilendi." });
  } catch (error) {
    res.status(500).json({ message: "Token yenileme işleminde bir hata oluştu." });
  }
};

// Kullanıcı çıkış işlemi
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh-token" });

    res.status(200).json({ message: "Başarıyla çıkış yapıldı." });
  } catch (error) {
    res.status(500).json({ message: "Çıkış işleminde bir hata oluştu." });
  }
};

module.exports = { registerUser, loginUser, refreshTokens, logout };