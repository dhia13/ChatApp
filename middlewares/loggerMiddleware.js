const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Configure log file path
const logDirectory = path.join(__dirname, '../logs');
const logFilePath = path.join(logDirectory, 'logs.log');
const errorLogFilePath = path.join(logDirectory, 'error.log');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Ensure log file exists
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}
if (!fs.existsSync(errorLogFilePath)) {
  fs.writeFileSync(errorLogFilePath, '');
}

// Configure Winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(), // Output to console
    new winston.transports.File({ filename: logFilePath }), // Output to log file
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: errorLogFilePath }), // Output to error log file
  ],
});

// Error logging middleware
function errorLogger(err, req, res, next) {
  console.log('hi');
  logger.error(err.message || err);
  next(err);
}

function createLogMiddleware() {
  return (req, res, next) => {
    res.on('finish', () => {
      const { method, originalUrl } = req;
      const { statusCode, statusMessage } = res;
      const contentLength = res.get('Content-Length') || '-';
      const logMessage = `${method} ${originalUrl} ${statusCode}  ${contentLength} ${statusMessage}`;
      logger.info(logMessage);
    });

    next();
  };
}

module.exports = {
  createLogMiddleware,
  errorLogger,
};
