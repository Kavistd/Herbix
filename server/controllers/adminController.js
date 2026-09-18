const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/Order');
const User = require('../models/User');
const { transitions, serializeOrder, cancelOrder, fail } = require('../services/orderService');
const getAllOrders = asyncHandler(async (req, res) => {
  const filter = { stockState: { $ne: 'RESERVING' } };
  const { q, status, paymentStatus, sort } = req.query;
  if (status) {
    if (!Order.ORDER_STATUSES.includes(status)) fail('Invalid order status filter');
    filter.$and = [{ $or: [{ orderStatus: status }, { orderStatus: { $exists: false }, status: status.toLowerCase() }] }];
  }
  if (paymentStatus) {
    if (!Order.PAYMENT_STATUSES.includes(paymentStatus)) fail('Invalid payment status filter');
    if (paymentStatus === 'PENDING') (filter.$and ||= []).push({ $or: [{ paymentStatus }, { paymentStatus: { $exists: false } }] });
    else filter.paymentStatus = paymentStatus;
  }
  if (q) {
    if (typeof q !== 'string' || q.length > 200) fail('Invalid search');
    const escaped = q.trim().replace(/[.*+?^$()|[\]{}\\]/g, '\\$&');
    filter.$or = ['orderNumber', 'customer.name', 'customer.email', 'customer.firstName', 'customer.lastName'].map(field => ({ [field]: { $regex: escaped, $options: 'i' } }));
  }
  if (sort && !['newest', 'oldest'].includes(sort)) fail('Invalid sort');
  const orders = await Order.find(filter).sort({ createdAt: sort === 'oldest' ? 1 : -1, _id: sort === 'oldest' ? 1 : -1 }).lean();
  res.json({ success: true, count: orders.length, data: orders.map(serializeOrder) });
});
const getAdminOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) fail('Order not found', 404);
  res.json({ success: true, data: serializeOrder(order) });
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const next = req.body.orderStatus || req.body.status;
  if (!Order.ORDER_STATUSES.includes(next)) fail('Invalid order status');
  const order = await Order.findById(req.params.id).lean();
  if (!order) fail('Order not found', 404);
  if (order.stockState === 'RESERVING') fail('Order is still being placed', 409);
  const current = serializeOrder(order).orderStatus;
  if (next === 'CANCELLED') {
    const updated = await cancelOrder(order, req.user._id);
    return res.json({ success: true, data: serializeOrder(updated) });
  }
  if (next === current) return res.json({ success: true, data: serializeOrder(order) });
  if (!transitions[current]?.includes(next)) fail('Cannot change ' + current + ' to ' + next, 409);
  const updated = await Order.findOneAndUpdate({
    _id: order._id, ...(order.orderStatus ? { orderStatus: current } : { orderStatus: { $exists: false }, status: order.status })
  }, { $set: { orderStatus: next, status: next.toLowerCase() }, $push: { statusHistory: { status: next, at: new Date(), by: req.user._id } } }, { new: true }).lean();
  if (!updated) fail('Order changed. Refresh and try again.', 409);
  res.json({ success: true, data: serializeOrder(updated) });
});
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const next = req.body.paymentStatus;
  if (!Order.PAYMENT_STATUSES.includes(next)) fail('Invalid payment status');
  const order = await Order.findById(req.params.id).lean();
  if (!order) fail('Order not found', 404);
  const normalized = serializeOrder(order);
  const current = normalized.paymentStatus;
  if (current === next) return res.json({ success: true, data: normalized });
  const allowed = { PENDING: ['PAID', 'FAILED'], FAILED: ['PENDING', 'PAID'], PAID: ['REFUNDED'], REFUNDED: [] };
  if (!allowed[current].includes(next)) fail('Invalid payment status transition', 409);
  if (next === 'PAID' && normalized.orderStatus !== 'DELIVERED') fail('Record COD payment only after delivery', 409);
  if (next === 'REFUNDED' && !['CANCELLED', 'DELIVERED'].includes(normalized.orderStatus)) fail('Refunds require a cancelled or delivered order', 409);
  if (normalized.orderStatus === 'CANCELLED' && next !== 'REFUNDED') fail('Cancelled orders cannot receive payment', 409);
  const updated = await Order.findOneAndUpdate({
    _id: order._id, paymentStatus: order.paymentStatus ?? { $exists: false },
    ...(order.orderStatus ? { orderStatus: order.orderStatus } : { status: order.status })
  }, { $set: { paymentStatus: next } }, { new: true }).lean();
  if (!updated) fail('Order changed. Refresh and try again.', 409);
  res.json({ success: true, data: serializeOrder(updated) });
});
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'CUSTOMER' }).sort({ createdAt: -1 }).lean();
  const ids = customers.map(c => c._id);
  // Cover both new orders (customer.user) and legacy orders (top-level user field).
  const orderCounts = await Order.aggregate([
    {
      $match: {
        stockState: { $ne: 'RESERVING' },
        $or: [{ 'customer.user': { $in: ids } }, { user: { $in: ids }, 'customer.user': { $exists: false } }]
      }
    },
    {
      $group: {
        _id: { $ifNull: ['$customer.user', '$user'] },
        count: { $sum: 1 }
      }
    }
  ]);
  const countMap = orderCounts.reduce((acc, row) => { acc[row._id.toString()] = row.count; return acc; }, {});
  res.json({ success: true, data: customers.map(c => ({ ...c, orderCount: countMap[c._id.toString()] || 0 })) });
});
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'CUSTOMER' }).lean();
  if (!customer) fail('Customer not found', 404);
  // Cover both new orders (customer.user) and legacy orders (top-level user field).
  const orderDocs = await Order.find({
    stockState: { $ne: 'RESERVING' },
    $or: [{ 'customer.user': customer._id }, { user: customer._id, 'customer.user': { $exists: false } }]
  }).sort({ createdAt: -1 }).lean();
  // Normalise via serializeOrder so orderStatus/paymentStatus are always present.
  const orders = orderDocs.map(o => {
    const s = serializeOrder(o);
    return { _id: s._id, orderNumber: s.orderNumber, total: s.total, orderStatus: s.orderStatus, paymentStatus: s.paymentStatus, createdAt: s.createdAt };
  });
  res.json({ success: true, data: { ...customer, orders } });
});
module.exports = { getAllOrders, getAdminOrderById, updateOrderStatus, updatePaymentStatus, getCustomers, getCustomerById };
