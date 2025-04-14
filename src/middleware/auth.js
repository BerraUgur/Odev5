const jwt = require("jsonwebtoken");
const { accessToken, refreshToken } = require("../config/jwtConfig");
const RefreshToken = require("../models/RefreshToken");

// Erişim token'ını doğrulama işlemi
const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Erişim token'ı gereklidir." });
  }

  try {
    const decoded = jwt.verify(token, accessToken.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Geçersiz veya süresi dolmuş erişim token'ı." });
  }
};

// Yenileme token'ını doğrulama işlemi
const verifyRefreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    return res.status(403).json({ message: "Yenileme token'ı gereklidir." });
  }

  try {
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      return res.status(403).json({ message: "Geçersiz yenileme token'ı." });
    }

    const decoded = jwt.verify(token, refreshToken.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      await RefreshToken.deleteOne({
        token: req.cookies.refreshToken || req.body.refreshToken,
      });
      return res.status(403).json({ message: "Süresi dolmuş yenileme token'ı." });
    }
    return res.status(403).json({ message: "Geçersiz yenileme token'ı." });
  }
};

// Rol tabanlı yetkilendirme işlemi
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Erişim reddedildi: Yetersiz yetki." });
    }
    next();
  };
};

module.exports = { verifyAccessToken, verifyRefreshToken, authorizeRoles };