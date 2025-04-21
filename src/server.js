require('dotenv').config();
const app = require("./app");
const connectDB = require("./config/dbConfig");

const PORT = process.env.PORT || 3000;

// Database connection is verified
connectDB();

// Server initialization is handled here
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});