const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// Function to log events
const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}`;

  try {
    // Ensure the logs directory exists
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    // Append the log item to the specified log file
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem + "\n"
    );
  } catch (error) {
    console.error("Error occurred while logging:", error);
  }
};

// Middleware to log HTTP requests
const logger = (req, res, next) => {
  const message = `${req.method}\t${req.url}\t${req.headers.origin || "unknown"}`;
  logEvents(message, "reqLog.log");
  next();
};

module.exports = { logEvents, logger };