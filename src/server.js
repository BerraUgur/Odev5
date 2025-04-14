require('dotenv').config();
const app = require("./app");
const connectDB = require("./config/dbConfig");

const PORT = process.env.PORT || 3000;

// Veritabanı bağlantısı kontrol edilir
connectDB();

// Sunucu başlatma işlemi burada gerçekleştirilir
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});