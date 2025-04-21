const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// Logging errors
const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "dd.MM.yyyy\tHH.mm.ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}`;

  try {
    // Create log directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    // Write to log file
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem + "\n"
    );
  } catch (error) {
    console.error("An error occurred during logging:", error);
  }
};

// Middleware for logging operations
const logger = (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin || "no-origin"}`;
  logEvents(message, "reqLog.log");
  next();
};

module.exports = { logEvents, logger };