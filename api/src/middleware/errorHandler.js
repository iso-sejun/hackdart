function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'Server error',
      details: err.details || null,
    },
  });
}

module.exports = errorHandler;
