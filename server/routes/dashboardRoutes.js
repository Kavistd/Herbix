const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', authenticateUser, authorizeRoles('ADMIN'), getStats);

module.exports = router;
