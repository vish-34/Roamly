const { failure } = require('../utils/apiResponse');

function notFoundHandler(req, res) {
  return res.status(404).json(failure(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  void next;
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  return res.status(statusCode).json(failure(message, error.details));
}

module.exports = { notFoundHandler, errorHandler };
