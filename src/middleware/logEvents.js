const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// Loglama işlemi
const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "dd.MM.yyyy\tHH.mm.ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}`;

  try {
    // Log dizini yoksa oluştur
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    // Log dosyasına yaz
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem + "\n"
    );
  } catch (error) {
    console.error("Loglama sırasında bir hata oluştu:", error);
  }
};

// İstek loglama middleware'i
const logger = (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin || "no-origin"}`;
  logEvents(message, "reqLog.log");
  next();
};

module.exports = { logEvents, logger };