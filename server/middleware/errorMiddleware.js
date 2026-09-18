/**
 * 404 handler — runs when no route matched. Must be mounted AFTER all routes.
 */
function notFound(req, res, next) {
  res.status(404);
  next(new Error(`API route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Centralized error handler — runs when any middleware/controller calls
 * next(err) or throws inside an asyncHandler-wrapped function.
 * Must be mounted LAST, after every other app.use()/route.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // If a controller already set a real error status, keep it; otherwise 500.
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal server error';

  // Common Mongoose error shapes get friendlier, consistent responses.
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}

module.exports = { notFound, errorHandler };
