const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

/**
 * Signs a JWT carrying the user's id and role. Kept deliberately minimal —
 * role-based checks re-verify against the database in authMiddleware rather
 * than trusting stale token claims for anything sensitive.
 */
function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
}

module.exports = generateToken;
