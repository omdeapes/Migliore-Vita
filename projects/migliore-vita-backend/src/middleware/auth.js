const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * JWT authentication middleware
 * Attaches user payload to req.user
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev-secret-change-in-production'
    );
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please login again' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Role-based access control middleware factory
 * Usage: requireRole('admin', 'accountant')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    console.log('requireRole middleware triggered');
    console.log('req.user:', req.user);
    console.log('Allowed roles:', roles);

    if (!req.user) {
      console.log('No req.user found');
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`User role ${req.user.role} not in allowed roles`);
      logger.warn(
        `Access denied: ${req.user.email} (${req.user.role}) tried to access ${req.method} ${req.path}`
      );
      return res.status(403).json({
        error: 'Access denied',
        message: `Requires role: ${roles.join(' or ')}`,
      });
    }

    console.log('Access granted');
    next();
  };
}

module.exports = { requireAuth, requireRole };
