const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsConfig");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const loanRoutes = require("./routes/loanRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Middleware'ler uygulama seviyesinde tanımlanır
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger);

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/reviews", reviewRoutes);

// Statik dosyalar için dizin ayarlanır
app.use(express.static(path.join(__dirname, "views")));

// Hata yakalama middleware'i eklenir
app.use(errorHandler);

module.exports = app;