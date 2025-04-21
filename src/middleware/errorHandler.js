const { logEvents } = require("./logEvents");

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error details
  const errorMessage = `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin || "unknown"}`;
  logEvents(errorMessage, "errLog.log");

  console.error(err.stack);
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status);

  // Return detailed error response
  res.json({
    message: err.message,
    type: err.name,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
