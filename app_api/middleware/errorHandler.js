// app_api/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);

  const status = err.status || err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
  };

  // Include validation details if present
  if (err.errors) payload.errors = err.errors;

  res.status(status).json(payload);
};
