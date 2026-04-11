const jwt = require('jsonwebtoken');

function extractToken(req) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}

function requireAuth(req, _res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      error.code = 'AUTH_REQUIRED';
      throw error;
    }

    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.code = error.code || 'INVALID_TOKEN';
    next(error);
  }
}

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      const error = new Error('You do not have access to this resource');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
