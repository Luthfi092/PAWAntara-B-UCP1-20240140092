// lib/logger.js
// Middleware custom di luar auth: mencatat method + endpoint + waktu
// setiap request yang masuk ke terminal.

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
