const winston = require('winston');
const path = require('path');
// Define log levels and corresponding colors
const logLevels = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

// Create a custom logger
const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
  ],
});

module.exports = logger;
