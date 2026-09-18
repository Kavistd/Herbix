const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Normalise the effective order status the same way serializeOrder does:
// new orders use orderStatus; legacy orders only have a lowercase status string.
const effectiveStatus = { $ifNull: ['$orderStatus', { $toUpper: '$status' }] };

async function getDashboardStats() {
  const [totalCustomers, activeProducts, totalOrders, revenueAgg, ordersByStatus, recentOrderDocs] = await Promise.all([
    User.countDocuments({ role: 'CUSTOMER' }),
    Product.countDocuments({ status: 'ACTIVE' }),
    Order.countDocuments({ stockState: { $ne: 'RESERVING' } }),
    // Revenue: exclude cancelled (both field variants) and in-flight reservations.
    Order.aggregate([
      {
        $match: {
          stockState: { $ne: 'RESERVING' },
          $expr: { $ne: [effectiveStatus, 'CANCELLED'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    // Status breakdown: use the same dual-field normalisation as serializeOrder.
    Order.aggregate([
      { $match: { stockState: { $ne: 'RESERVING' } } },
      { $group: { _id: effectiveStatus, count: { $sum: 1 } } }
    ]),
    // Recent orders: fetch full docs so serializeOrder can normalise legacy fields.
    Order.find({ stockState: { $ne: 'RESERVING' } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;
  const statusBreakdown = ordersByStatus.reduce((acc, row) => {
    if (row._id) acc[row._id] = row.count;
    return acc;
  }, {});

  // Run each recent order through serializeOrder so customer.name, orderStatus,
  // and paymentStatus are always present regardless of legacy vs new schema.
  const { serializeOrder } = require('./orderService');
  const recentOrders = recentOrderDocs.map(serializeOrder);

  return {
    totalCustomers,
    activeProducts,
    totalOrders,
    totalRevenue,
    pendingOrders: statusBreakdown['PENDING'] || 0,
    statusBreakdown,
    recentOrders
  };
}

module.exports = { getDashboardStats };
