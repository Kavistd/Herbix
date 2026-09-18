const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/Order');
const { placeOrder, serializeOrder, ownerFilter, fail } = require('../services/orderService');
const createOrder = asyncHandler(async (req, res) => {
  const order = await placeOrder(req.body, req.user, req.get('Idempotency-Key'));
  res.status(201).json({ success: true, data: serializeOrder(order) });
});
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ ...ownerFilter(req.user._id), stockState: { $ne: 'RESERVING' } }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: orders.length, data: orders.map(serializeOrder) });
});
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, ...ownerFilter(req.user._id), stockState: { $ne: 'RESERVING' } }).lean();
  if (!order) fail('Order not found', 404);
  res.json({ success: true, data: serializeOrder(order) });
});
module.exports = { createOrder, getMyOrders, getOrderById };
