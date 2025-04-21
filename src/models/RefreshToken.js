const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  // Token'a ait kullanıcı ID'si
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Refresh token değeri
  token: {
    type: String,
    required: true,
  },
  // Token oluşturulma tarihi
  createdAt: {
    type: Date,
    default: Date.now,
    expired: 7 * 24 * 60 * 60 * 1000, // 7 gün
  },
});

// Add an index for token field
refreshTokenSchema.index({ token: 1 });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);