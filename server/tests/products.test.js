const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'isolated-product-test-secret';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const app = require('../app');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

test('MongoDB product management and storefront integration', { timeout: 120000 }, async t => {
  const mongo = await MongoMemoryServer.create();
  let server;
  try {
    await mongoose.connect(mongo.getUri());
    await Product.init();
    const admin = await User.create({ name: 'Admin', email: 'admin@example.test', password: 'password123', role: 'ADMIN' });
    const customer = await User.create({ name: 'Customer', email: 'customer@example.test', password: 'password123', role: 'CUSTOMER' });
    const token = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const adminToken = token(admin);
    const customerToken = token(customer);
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = 'http://127.0.0.1:' + server.address().port + '/api';
    async function request(route, method = 'GET', body, auth) {
      const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: 'Bearer ' + auth } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      return { status: response.status, body: await response.json() };
    }
    const draft = { name: 'Test Product', slug: 'test-product', shortDescription: 'Test description', description: 'Test only', ingredients: ['Test ingredient'], price: 123.50, stock: 5, images: ['/images/product.jpg'], category: 'Test', status: 'ACTIVE', featured: true, isComingSoon: false };
    let productId;
    await t.test('all admin product methods require authentication and ADMIN role', async () => {
      for (const [method, route, body] of [['GET', '/admin/products'], ['GET', '/admin/products/000000000000000000000000'], ['POST', '/admin/products', draft], ['PUT', '/admin/products/000000000000000000000000', draft], ['DELETE', '/admin/products/000000000000000000000000']]) {
        assert.equal((await request(route, method, body)).status, 401);
        assert.equal((await request(route, method, body, customerToken)).status, 403);
      }
    });
    await t.test('admin creates a product, public reads by ID and slug', async () => {
      const result = await request('/admin/products', 'POST', { ...draft, unexpected: 'ignored' }, adminToken);
      assert.equal(result.status, 201);
      productId = result.body.data._id;
      assert.equal(result.body.data.unexpected, undefined);
      assert.ok(result.body.data.createdAt);
      assert.ok(result.body.data.updatedAt);
      for (const id of [productId, draft.slug]) {
        const publicProduct = await request('/products/' + id);
        assert.equal(publicProduct.status, 200);
        assert.equal(publicProduct.body.data.price, draft.price);
      }
    });
    await t.test('reject invalid fields and duplicate slugs without changing stored data', async () => {
      for (const invalid of [{ price: -1 }, { price: null }, { price: '123' }, { stock: 1.2 }, { stock: -1 }, { stock: null }, { status: 'BAD' }, { featured: 'false' }, { isComingSoon: null }, { images: ['javascript:alert(1)'] }, { ingredients: 'text' }, { name: '' }, { slug: 'bad slug' }]) {
        assert.equal((await request('/admin/products/' + productId, 'PUT', invalid, adminToken)).status, 400, JSON.stringify(invalid));
      }
      assert.equal((await request('/admin/products', 'POST', draft, adminToken)).status, 400);
      assert.equal((await Product.findById(productId)).price, draft.price);
    });
    await t.test('inactive products are hidden publicly, including direct reads', async () => {
      await request('/admin/products/' + productId, 'PUT', { status: 'INACTIVE' }, adminToken);
      assert.equal((await request('/products')).body.count, 0);
      assert.equal((await request('/products/' + productId)).status, 404);
      assert.equal((await request('/products/' + draft.slug, 'GET', undefined, adminToken)).status, 404);
      assert.equal((await request('/admin/products/' + productId, 'GET', undefined, adminToken)).status, 200);
      assert.equal((await request('/admin/products', 'GET', undefined, adminToken)).body.count, 1);
    });
    await t.test('admin updates all management fields and public data follows', async () => {
      const result = await request('/admin/products/' + productId, 'PUT', { status: 'ACTIVE', price: 200, stock: 3, featured: false, isComingSoon: true, images: ['/images/lemon.jpg'], name: 'Updated Product' }, adminToken);
      assert.equal(result.status, 200);
      const visible = (await request('/products/' + productId)).body.data;
      assert.equal(visible.price, 200);
      assert.equal(visible.stock, 3);
      assert.equal(visible.featured, false);
      assert.equal(visible.isComingSoon, true);
      assert.deepEqual(visible.images, ['/images/lemon.jpg']);
    });
    await t.test('search escapes regex syntax and category filtering works', async () => {
      assert.equal((await request('/products?q=%5B')).status, 200);
      assert.equal((await request('/products?q=.*')).body.count, 0);
      assert.equal((await request('/products?category=Test')).body.count, 1);
      assert.equal((await request('/products?category=Other')).body.count, 0);
    });
    await t.test('deletion removes catalog record', async () => {
      assert.equal((await request('/admin/products/' + productId, 'DELETE', undefined, adminToken)).status, 200);
      assert.equal((await request('/products/' + productId)).status, 404);
      assert.equal(await Order.countDocuments(), 0);
      assert.equal((await request('/admin/products/' + productId, 'PUT', { price: 10 }, adminToken)).status, 404);
      assert.equal((await request('/admin/products/not-an-id', 'DELETE', undefined, adminToken)).status, 404);
    });
    await t.test('seed creates only Original and reruns preserve admin edits', async () => {
      const runSeed = () => execFileSync(process.execPath, ['seed/seed.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, MONGODB_URI: mongo.getUri(), ADMIN_EMAIL: '', ADMIN_PASSWORD: '' }, stdio: 'pipe' });
      runSeed();
      assert.equal(await Product.countDocuments(), 1);
      const original = await Product.findOne({ slug: 'herbix-original' });
      assert.equal(original.stock, 0);
      assert.equal(original.price, 850);
      await Product.updateOne({ _id: original._id }, { $set: { price: 999, stock: 7 } });
      runSeed();
      const retained = await Product.findById(original._id);
      assert.equal(retained.price, 999);
      assert.equal(retained.stock, 7);
    });
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    await mongoose.disconnect();
    await mongo.stop();
  }
});
