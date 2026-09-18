const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role
  };
}

/**
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Public registration can NEVER assign a role — `role` is intentionally
 * never read from req.body. Every account created through this endpoint is
 * hardcoded to CUSTOMER. Admin accounts only ever come from the seed script.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Name is required');
  }
  if (!email || !EMAIL_RE.test(email)) {
    res.status(400);
    throw new Error('A valid email address is required');
  }
  if (!password || password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name: name.trim(),
    email,
    password,
    phone,
    role: 'CUSTOMER' // explicit — public registration is never allowed to self-assign ADMIN
  });

  res.status(201).json({
    success: true,
    data: {
      user: sanitizeUser(user),
      token: generateToken(user)
    }
  });
});

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
      token: generateToken(user)
    }
  });
});

/**
 * @route   GET /api/auth/me
 * @access  Private (any authenticated role)
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by the `authenticateUser` middleware, password already excluded
  res.json({ success: true, data: sanitizeUser(req.user) });
});

module.exports = { register, login, getMe };
