const jwt = require("jsonwebtoken");
const sanitize = require('mongo-sanitize');
const { accessToken, refreshToken } = require("../config/jwtConfig");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const ROLES = require('../constants/roles');

// Function to generate access and refresh tokens
const generateTokens = (user) => {
  const accessTokenPayload = { id: user._id, email: user.email, role: user.role };
  const refreshTokenPayload = { id: user._id };

  return {
    accessToken: jwt.sign(accessTokenPayload, accessToken.secret, { expiresIn: accessToken.expiresIn }),
    refreshToken: jwt.sign(refreshTokenPayload, refreshToken.secret, { expiresIn: refreshToken.expiresIn }),
  };
};

// User registration process
const registerUser = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { username, email, password, role = ROLES.USER } = sanitizedBody;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields must be filled." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email address is already registered." });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while saving the user." });
  }
};

// User login process
const loginUser = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { email, password } = sanitizedBody;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
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
    res.status(200).json({ message: "Login successful!", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during user login." });
  }
};

// Token refresh process
const refreshTokens = async (req, res) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    const storedToken = await RefreshToken.findOne({ token: oldRefreshToken });
    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const decoded = jwt.verify(oldRefreshToken, refreshToken.secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
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

    res.status(200).json({ message: "Tokens successfully refreshed." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during token refresh." });
  }
};

// Logout process
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh-token" });

    res.status(200).json({ message: "Successfully logged out." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during logout." });
  }
};

module.exports = { registerUser, loginUser, refreshTokens, logout };