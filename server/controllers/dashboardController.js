const asyncHandler = require('../utils/asyncHandler');
const { getDashboardStats } = require('../services/dashboardService');

/**
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  res.json({ success: true, data: stats });
});

module.exports = { getStats };
