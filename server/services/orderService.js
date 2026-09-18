const { randomBytes, createHash } = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

const transitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'], SHIPPED: ['DELIVERED'], DELIVERED: [], CANCELLED: []
};
function fail(message, status = 400) { const err = new Error(message); err.statusCode = status; throw err; }
const money = value => Math.round((value + Number.EPSILON) * 100) / 100;
function serializeOrder(document) {
  const order = document.toObject ? document.toObject() : { ...document };
  const customer = order.customer || {};
  order.customer = { ...customer, user: customer.user || order.user || null, name: customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(' ') };
  if (!order.shippingAddress?.address) order.shippingAddress = Object.fromEntries(['firstName', 'lastName', 'address', 'city', 'district', 'postalCode'].map(key => [key, customer[key] || '']));
  order.orderStatus = order.orderStatus || (order.status || 'pending').toUpperCase();
  order.paymentStatus = order.paymentStatus || 'PENDING';
  order.discount = order.discount ?? order.discountAmount ?? 0;
  order.items = order.items.map(item => ({ ...item, image: item.image || '', unitPrice: item.unitPrice ?? item.price, itemTotal: item.itemTotal ?? money((item.unitPrice ?? item.price) * item.quantity) }));
  order.statusHistory = order.statusHistory || [];
  delete order.checkoutKey; delete order.requestHash;
  return order;
}
const ownerFilter = userId => ({ $or: [{ 'customer.user': userId }, { user: userId, 'customer.user': { $exists: false } }] });

// Each product update removes its reservation and increments stock atomically.
// Concurrent/repeated cancellation cannot restore the same reservation twice.
async function restoreStock(order) {
  for (const item of order.items) {
    if (order.inventoryVersion === 1) {
      await Product.updateOne({ _id: item.product, 'orderReservations.order': order._id }, {
        $inc: { stock: item.quantity }, $pull: { orderReservations: { order: order._id } }
      });
    } else {
      // Prior-version orders deducted stock without reservation markers.
      await Product.updateOne({ _id: item.product, restoredLegacyOrders: { $ne: order._id } }, {
        $inc: { stock: item.quantity }, $addToSet: { restoredLegacyOrders: order._id }
      });
    }
  }
  await Order.updateOne({ _id: order._id, orderStatus: 'CANCELLED' }, { $set: { stockState: 'RESTORED' } });
}
async function cancelOrder(order, by) {
  const state = serializeOrder(order).orderStatus;
  if (state !== 'CANCELLED' && !transitions[state]?.includes('CANCELLED')) fail('This order can no longer be cancelled', 409);
  const filter = { _id: order._id, ...(order.orderStatus ? { orderStatus: state } : { status: order.status, orderStatus: { $exists: false } }) };
  if (state !== 'CANCELLED') {
    const result = await Order.updateOne(filter, {
      $set: { orderStatus: 'CANCELLED', status: 'cancelled', stockState: 'RESTORING' },
      $push: { statusHistory: { status: 'CANCELLED', at: new Date(), by } }
    });
    if (!result.modifiedCount) fail('Order changed. Refresh and try again.', 409);
  }
  if (order.stockState !== 'RESTORED') await restoreStock(order);
  return Order.findById(order._id).lean();
}
// Run before accepting requests after a single API-process restart.
// Incomplete placements are cancelled; interrupted cancellations are resumed.
async function recoverInventory() {
  const incomplete = await Order.find({ stockState: { $in: ['RESERVING', 'RESTORING'] } }).lean();
  for (const order of incomplete) await cancelOrder(order);
}

async function placeOrder(body, user, key) {
  if (!body || !Array.isArray(body.items) || !body.items.length || body.items.length > 100) fail('Provide between 1 and 100 order items');
  const items = body.items.map(item => {
    if (!item || typeof item.product !== 'string' || !/^[a-f0-9]{24}$/i.test(item.product) || !Number.isSafeInteger(item.quantity) || item.quantity < 1) fail('Each item needs a product ID and positive whole-number quantity');
    return { product: item.product.toLowerCase(), quantity: item.quantity };
  }).sort((a, b) => a.product.localeCompare(b.product));
  if (new Set(items.map(item => item.product)).size !== items.length) fail('Duplicate product IDs are not allowed');
  const address = body.shippingAddress || body.customer || {};
  const shippingAddress = {};
  for (const field of ['firstName', 'lastName', 'address', 'city', 'district', 'postalCode']) {
    if (typeof address[field] !== 'string' || !address[field].trim() || address[field].length > 300) fail('Valid shipping ' + field + ' is required');
    shippingAddress[field] = address[field].trim();
  }
  const contact = body.customer || {};
  const email = contact.email ?? user.email;
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254) fail('A valid contact email is required');
  if (typeof contact.phone !== 'string' || !/^[+()\d\s-]{9,25}$/.test(contact.phone)) fail('A valid contact phone is required');
  const deliveryMethod = body.deliveryMethod || 'standard';
  if (!['standard', 'pickup'].includes(deliveryMethod)) fail('Invalid delivery method');
  if (body.paymentMethod && body.paymentMethod !== 'cod') fail('Only Cash on Delivery is supported');
  const couponCode = typeof body.couponCode === 'string' ? body.couponCode.trim().toUpperCase() : '';
  const rates = { COMFORT15: 0.15, HERBIX10: 0.10 };
  if (couponCode && !Object.hasOwn(rates, couponCode)) fail('Invalid promo code');
  if (key && (typeof key !== 'string' || !/^[a-zA-Z0-9-]{8,100}$/.test(key))) fail('Invalid checkout request key');
  const checkoutKey = key ? String(user._id) + ':' + key : undefined;
  const customer = { user: user._id, name: user.name, email: email.trim().toLowerCase(), phone: contact.phone.trim() };
  const requestHash = createHash('sha256').update(JSON.stringify({ items, shippingAddress, customer, deliveryMethod, couponCode })).digest('hex');
  if (checkoutKey) {
    const existing = await Order.findOne({ checkoutKey }).select('+requestHash').lean();
    if (existing) {
      if (existing.requestHash !== requestHash) fail('This checkout key was already used for different details', 409);
      if (existing.stockState !== 'DEDUCTED') fail('This checkout attempt is incomplete or cancelled. Start a new checkout.', 409);
      return existing;
    }
  }
  const products = await Product.find({ _id: { $in: items.map(item => item.product) }, status: 'ACTIVE', isComingSoon: false });
  if (products.length !== items.length) fail('A product is no longer available', 409);
  const snapshots = items.map(item => {
    const product = products.find(p => String(p._id) === item.product);
    if (product.stock < item.quantity) fail(product.name + ' has insufficient stock', 409);
    return { product: product._id, name: product.name, image: product.images?.[0] || product.image || '', quantity: item.quantity, unitPrice: product.price, itemTotal: money(product.price * item.quantity) };
  });
  const subtotal = money(snapshots.reduce((sum, item) => sum + item.itemTotal, 0));
  const discount = Math.round(subtotal * (rates[couponCode] || 0));
  const deliveryFee = deliveryMethod === 'pickup' || subtotal >= 2000 ? 0 : 350;
  if (!Number.isFinite(subtotal) || subtotal > Number.MAX_SAFE_INTEGER / 100) fail('Order value is too large');
  let order;
  // A unique index backs the readable random order number; retry rare collisions.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      order = await Order.create({
        orderNumber: 'HBX-' + new Date().getFullYear() + '-' + randomBytes(4).toString('hex').toUpperCase(),
        customer, shippingAddress, items: snapshots, deliveryMethod, paymentMethod: 'cod',
        paymentStatus: 'PENDING', orderStatus: 'PENDING', subtotal, discount, deliveryFee,
        total: money(subtotal + deliveryFee - discount), couponCode: couponCode || null,
        stockState: 'RESERVING', inventoryVersion: 1, checkoutKey, requestHash,
        statusHistory: [{ status: 'PENDING', at: new Date(), by: user._id }]
      });
      break;
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.orderNumber) continue;
      if (err.code === 11000 && err.keyPattern?.checkoutKey) fail('Checkout is already being submitted. Please retry.', 409);
      throw err;
    }
  }
  if (!order) fail('Could not allocate an order number. Please retry.', 503);
  try {
    for (const item of snapshots) {
      const result = await Product.updateOne({
        _id: item.product, status: 'ACTIVE', isComingSoon: false, price: item.unitPrice,
        stock: { $gte: item.quantity }, 'orderReservations.order': { $ne: order._id }
      }, { $inc: { stock: -item.quantity }, $push: { orderReservations: { order: order._id, quantity: item.quantity } } });
      if (!result.modifiedCount) fail('Stock or price changed. Please review your bag.', 409);
    }
    await Order.updateOne({ _id: order._id, stockState: 'RESERVING' }, { $set: { stockState: 'DEDUCTED' } });
  } catch (err) {
    await cancelOrder(order.toObject(), user._id);
    throw err;
  }
  return Order.findById(order._id).lean();
}
module.exports = { transitions, serializeOrder, ownerFilter, restoreStock, recoverInventory, cancelOrder, placeOrder, fail };
