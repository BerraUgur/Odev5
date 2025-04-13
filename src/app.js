const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsConfig");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger);

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

// Static dosyalar
app.use(express.static(path.join(__dirname, "views")));

// Hata yakalama
app.use(errorHandler);

module.exports = app;