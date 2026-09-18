const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'order-test-only-secret';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { recoverInventory } = require('../services/orderService');

test('complete order lifecycle and security using real MongoDB', { timeout: 120000 }, async t => {
  const mongo = await MongoMemoryServer.create();
  let server;
  try {
    await mongoose.connect(mongo.getUri());
    await Promise.all([Order.init(), Product.init(), User.init()]);
    await User.create({ name: 'Order Admin', email: 'admin@orders.test', password: 'Password123!', role: 'ADMIN' });
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = 'http://127.0.0.1:' + server.address().port + '/api';
    async function request(route, method = 'GET', body, token, key) {
      const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(key ? { 'Idempotency-Key': key } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      return { status: response.status, body: await response.json() };
    }
    let token, otherToken, adminToken, customerId;
    await t.test('register customers and login through existing JWT/bcrypt auth', async () => {
      const registered = await request('/auth/register', 'POST', { name: 'Order Customer', email: 'buyer@orders.test', password: 'Password123!', role: 'ADMIN' });
      assert.equal(registered.status, 201);
      assert.equal(registered.body.data.user.role, 'CUSTOMER');
      customerId = registered.body.data.user.id;
      const loggedIn = await request('/auth/login', 'POST', { email: 'buyer@orders.test', password: 'Password123!' });
      assert.equal(loggedIn.status, 200);
      token = loggedIn.body.data.token;
      otherToken = (await request('/auth/register', 'POST', { name: 'Other Customer', email: 'other@orders.test', password: 'Password123!' })).body.data.token;
      adminToken = (await request('/auth/login', 'POST', { email: 'admin@orders.test', password: 'Password123!' })).body.data.token;
    });
    const product = await Product.create({ name: 'Test Order Product', slug: 'test-order-product', price: 850, stock: 30, status: 'ACTIVE', images: ['/images/product.jpg'] });
    const address = { firstName: 'Order', lastName: 'Buyer', address: 'Test address', city: 'Colombo', district: 'Colombo', postalCode: '00100' };
    const payload = { items: [{ product: String(product._id), quantity: 2 }], customer: { email: 'buyer@orders.test', phone: '0770000000', user: '000000000000000000000000', name: 'Forged' }, shippingAddress: address, deliveryMethod: 'standard', paymentMethod: 'cod', couponCode: 'HERBIX10' };
    let id;
    await t.test('browse, place order, calculate totals on backend, and save snapshots', async () => {
      assert.equal((await request('/products')).body.count, 1);
      const result = await request('/orders', 'POST', { ...payload, items: [{ ...payload.items[0], price: 1, unitPrice: 1, name: 'Forged' }], subtotal: 1, total: 1, discount: 9999, deliveryFee: 0, paymentStatus: 'PAID', orderStatus: 'DELIVERED' }, token, 'checkout-test-0001');
      assert.equal(result.status, 201, JSON.stringify(result.body));
      const order = result.body.data;
      id = order._id;
      assert.match(order.orderNumber, /^HBX-\d{4}-[A-F0-9]{8}$/);
      assert.equal(order.customer.user, customerId);
      assert.equal(order.customer.name, 'Order Customer');
      assert.equal(order.items[0].name, product.name);
      assert.equal(order.items[0].image, '/images/product.jpg');
      assert.equal(order.items[0].unitPrice, 850);
      assert.equal(order.items[0].itemTotal, 1700);
      assert.equal(order.subtotal, 1700);
      assert.equal(order.deliveryFee, 350);
      assert.equal(order.discount, 170);
      assert.equal(order.total, 1880);
      assert.equal(order.paymentStatus, 'PENDING');
      assert.equal(order.orderStatus, 'PENDING');
      assert.equal((await Product.findById(product._id)).stock, 28);
      assert.equal((await Order.findById(id)).orderNumber, order.orderNumber);
      assert.equal((await request('/orders/my-orders', 'GET', undefined, token)).body.data[0]._id, id);
    });
    await t.test('idempotent checkout retry cannot deduct stock twice', async () => {
      const result = await request('/orders', 'POST', payload, token, 'checkout-test-0001');
      assert.equal(result.status, 201);
      assert.equal(result.body.data._id, id);
      assert.equal((await Product.findById(product._id)).stock, 28);
      assert.equal((await request('/orders', 'POST', { ...payload, deliveryMethod: 'pickup' }, token, 'checkout-test-0001')).status, 409);
    });
    await t.test('reject guests, admin checkout, cross-customer reads, and customer admin mutations', async () => {
      assert.equal((await request('/orders', 'POST', payload)).status, 401);
      assert.equal((await request('/orders', 'POST', payload, adminToken)).status, 403);
      assert.equal((await request('/orders/my-orders')).status, 401);
      assert.equal((await request('/orders/' + id, 'GET', undefined, otherToken)).status, 404);
      assert.equal((await request('/orders/my-orders', 'GET', undefined, otherToken)).body.count, 0);
      for (const [route, method, body] of [
        ['/admin/orders', 'GET'], ['/admin/orders/' + id, 'GET'],
        ['/admin/orders/' + id + '/status', 'PATCH', { orderStatus: 'CONFIRMED' }],
        ['/admin/orders/' + id + '/payment-status', 'PATCH', { paymentStatus: 'PAID' }]
      ]) {
        assert.equal((await request(route, method, body)).status, 401);
        assert.equal((await request(route, method, body, token)).status, 403);
      }
      assert.equal((await request('/orders/not-an-id', 'GET', undefined, token)).status, 404);
    });
    await t.test('admin confirms; customer refresh sees CONFIRMED; filters and details work', async () => {
      const result = await request('/admin/orders/' + id + '/status', 'PATCH', { orderStatus: 'CONFIRMED' }, adminToken);
      assert.equal(result.status, 200);
      assert.equal((await request('/orders/my-orders', 'GET', undefined, token)).body.data.find(order => order._id === id).orderStatus, 'CONFIRMED');
      assert.equal((await request('/admin/orders/' + id, 'GET', undefined, adminToken)).body.data.shippingAddress.city, 'Colombo');
      assert.equal((await request('/admin/orders?q=Order%20Customer&status=CONFIRMED&paymentStatus=PENDING&sort=oldest', 'GET', undefined, adminToken)).body.count, 1);
      assert.equal((await request('/admin/orders?q=%5B', 'GET', undefined, adminToken)).status, 200);
      assert.equal((await request('/admin/orders?status=invalid', 'GET', undefined, adminToken)).status, 400);
      assert.equal((await request('/admin/orders/' + id + '/status', 'PATCH', { orderStatus: 'DELIVERED' }, adminToken)).status, 409);
      assert.equal((await request('/admin/orders/' + id + '/payment-status', 'PATCH', { paymentStatus: 'PAID' }, adminToken)).status, 409);
    });
    await t.test('advance through processing/shipping/delivery and record COD payment', async () => {
      for (const orderStatus of ['PROCESSING', 'SHIPPED', 'DELIVERED']) {
        assert.equal((await request('/admin/orders/' + id + '/status', 'PATCH', { orderStatus }, adminToken)).status, 200);
        if (orderStatus === 'SHIPPED') assert.equal((await request('/admin/orders/' + id + '/status', 'PATCH', { orderStatus: 'CANCELLED' }, adminToken)).status, 409);
      }
      assert.equal((await request('/admin/orders/' + id + '/payment-status', 'PATCH', { paymentStatus: 'PAID' }, adminToken)).status, 200);
      const detail = (await request('/orders/' + id, 'GET', undefined, token)).body.data;
      assert.equal(detail.orderStatus, 'DELIVERED');
      assert.equal(detail.paymentStatus, 'PAID');
      assert.equal(detail.statusHistory.length, 5);
      assert.equal((await request('/admin/orders/' + id + '/status', 'PATCH', { orderStatus: 'PENDING' }, adminToken)).status, 409);
      assert.equal((await request('/admin/orders/' + id + '/payment-status', 'PATCH', { paymentStatus: 'REFUNDED' }, adminToken)).status, 200);
    });
    await t.test('validate quantities, products, address, methods and coupons', async () => {
      for (const quantity of [0, -1, 1.5, '2', null]) assert.equal((await request('/orders', 'POST', { ...payload, items: [{ product: String(product._id), quantity }] }, token)).status, 400);
      for (const extra of [{ paymentMethod: 'card' }, { shippingAddress: {} }, { deliveryMethod: 'free' }, { couponCode: '__proto__' }, { items: [...payload.items, ...payload.items] }]) assert.equal((await request('/orders', 'POST', { ...payload, ...extra }, token)).status, 400);
      assert.equal((await request('/orders', 'POST', { ...payload, items: [{ product: '000000000000000000000000', quantity: 1 }] }, token)).status, 409);
      for (const change of [{ isComingSoon: true }, { status: 'INACTIVE', isComingSoon: false }, { status: 'ACTIVE', stock: 0 }]) {
        await Product.updateOne({ _id: product._id }, { $set: change });
        assert.equal((await request('/orders', 'POST', payload, token)).status, 409);
      }
      await Product.updateOne({ _id: product._id }, { $set: { stock: 28 } });
    });
    await t.test('cancellation restores deducted stock once, including concurrent retries', async () => {
      const placed = (await request('/orders', 'POST', payload, token)).body.data;
      assert.equal((await Product.findById(product._id)).stock, 26);
      const results = await Promise.all([1, 2].map(() => request('/admin/orders/' + placed._id + '/status', 'PATCH', { orderStatus: 'CANCELLED' }, adminToken)));
      assert.ok(results.every(result => [200, 409].includes(result.status)));
      assert.equal((await request('/admin/orders/' + placed._id + '/status', 'PATCH', { orderStatus: 'CANCELLED' }, adminToken)).status, 200);
      assert.equal((await Product.findById(product._id)).stock, 28);
      assert.equal((await Order.findById(placed._id)).stockState, 'RESTORED');
      assert.equal((await request('/admin/orders/' + placed._id + '/status', 'PATCH', { orderStatus: 'CONFIRMED' }, adminToken)).status, 409);
    });
    await t.test('concurrent orders cannot oversell', async () => {
      await Product.updateOne({ _id: product._id }, { $set: { stock: 2 } });
      const results = await Promise.all([request('/orders', 'POST', payload, token), request('/orders', 'POST', payload, otherToken)]);
      assert.deepEqual(results.map(result => result.status).sort(), [201, 409]);
      assert.equal((await Product.findById(product._id)).stock, 0);
    });
    await t.test('failed multi-product reservation compensates only deducted items', async () => {
      const second = await Product.create({ name: 'Second', slug: 'second', price: 100, stock: 5, status: 'ACTIVE' });
      await Product.updateOne({ _id: product._id }, { $set: { stock: 5 } });
      const original = Product.updateOne;
      let reservations = 0;
      Product.updateOne = function(filter, update, ...rest) {
        if (update.$push?.orderReservations && ++reservations === 2) return Promise.resolve({ modifiedCount: 0 });
        return original.call(this, filter, update, ...rest);
      };
      try {
        const result = await request('/orders', 'POST', { ...payload, items: [{ product: String(product._id), quantity: 2 }, { product: String(second._id), quantity: 2 }] }, token);
        assert.equal(result.status, 409);
      } finally { Product.updateOne = original; }
      assert.equal((await Product.findById(product._id)).stock, 5);
      assert.equal((await Product.findById(second._id)).stock, 5);
    });
    await t.test('startup recovery resumes interrupted placement/cancellation idempotently', async () => {
      const placed = (await request('/orders', 'POST', payload, token)).body.data;
      await Order.updateOne({ _id: placed._id }, { $set: { stockState: 'RESERVING' } });
      await recoverInventory();
      await recoverInventory();
      assert.equal((await Product.findById(product._id)).stock, 5);
      assert.equal((await Order.findById(placed._id)).orderStatus, 'CANCELLED');
    });
    await t.test('snapshots survive product changes and deletion', async () => {
      await Product.findByIdAndDelete(product._id);
      const detail = (await request('/orders/' + id, 'GET', undefined, token)).body.data;
      assert.equal(detail.items[0].name, 'Test Order Product');
      assert.equal(detail.items[0].unitPrice, 850);
      assert.equal(detail.items[0].image, '/images/product.jpg');
    });
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await mongoose.disconnect(); await mongo.stop();
  }
});
