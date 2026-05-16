const logger = require('../config/logger');

/**
 * Global error handler
 * Must be registered LAST in middleware chain
 */
function errorHandler(err, req, res, next) {
  // Log error with context
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    user: req.user?.email,
    body: req.body,
  });

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => e.message),
    });
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Duplicate entry',
      field: err.errors[0]?.path,
    });
  }

  // JWT errors (should be caught in middleware, but just in case)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Default: 500
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
