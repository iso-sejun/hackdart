function requestContext(req, _res, next) {
  req.requestStartedAt = new Date().toISOString();
  next();
}

module.exports = requestContext;
