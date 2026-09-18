const express = require('express');
const { getUsers, getUserById } = require('../controllers/userController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// All user-management routes are admin-only for now; customers manage their
// own profile via /api/auth/me.
router.get('/', authenticateUser, authorizeRoles('ADMIN'), getUsers);
router.get('/:id', authenticateUser, authorizeRoles('ADMIN'), getUserById);

module.exports = router;
