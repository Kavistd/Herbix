const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { env } = require('../config/env');
const User = require('../models/User');

/**
 * authenticateUser
 * Verifies the Bearer JWT on the Authorization header and attaches the
 * corresponding user document (password excluded) to req.user.
 *
 * Usage:  router.get('/me', authenticateUser, getMe)
 */
const authenticateUser = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  const token = header.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized — invalid or expired token');
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('Not authorized — user no longer exists');
  }

  req.user = user;
  next();
});

/**
 * Like `authenticateUser`, but never rejects the request — if a valid Bearer
 * token is present it attaches req.user, otherwise the request continues as
 * a guest (req.user stays undefined). Used for routes like order creation
 * that must work for both logged-in customers and guest checkout.
 */
const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    const token = header.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Invalid/expired token on an optional-auth route — proceed as guest
      // rather than failing the request.
    }
  }

  next();
});

/**
 * authorizeRoles(...roles)
 * Restricts a route to one or more roles. Must run AFTER `authenticateUser`
 * (it relies on req.user being already set) — this is a real backend check,
 * never something the frontend can be trusted to enforce on its own.
 *
 * Usage:  router.get('/admin/stats', authenticateUser, authorizeRoles('ADMIN'), getStats)
 */
function authorizeRoles(...roles) {
  return function checkRole(req, res, next) {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized — no authenticated user');
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have permission to access this resource');
    }
    next();
  };
}

module.exports = { authenticateUser, attachUserIfPresent, authorizeRoles };
