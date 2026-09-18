const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const fields = ['name', 'slug', 'shortDescription', 'description', 'ingredients', 'price', 'stock', 'images', 'category', 'status', 'featured', 'isComingSoon'];
const identifier = id => /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { slug: id };
function fail(res, message) { res.status(400); throw new Error(message); }
function productInput(body, res) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) fail(res, 'Product data is required');
  const data = {};
  for (const key of fields) {
    if (!Object.prototype.hasOwnProperty.call(body, key)) continue;
    const value = body[key];
    if (['price', 'stock'].includes(key)) {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || (key === 'stock' && !Number.isSafeInteger(value)))
        fail(res, key + ' must be a non-negative ' + (key === 'stock' ? 'whole number' : 'number'));
    } else if (['featured', 'isComingSoon'].includes(key)) {
      if (typeof value !== 'boolean') fail(res, key + ' must be true or false');
    } else if (['images', 'ingredients'].includes(key)) {
      if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item.trim()))
        fail(res, key + ' must be a list of non-empty strings');
      if (key === 'images' && value.some(url => !/^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/.test(url)))
        fail(res, 'Images must be HTTP(S) URLs or local paths beginning with /');
    } else if (typeof value !== 'string') fail(res, key + ' must be text');
    data[key] = value;
  }
  return data;
}
const getProducts = asyncHandler(async (req, res) => {
  const filter = { status: 'ACTIVE' };
  const { category, q } = req.query;
  if (typeof category === 'string' && category !== 'All') filter.category = category;
  if (typeof q === 'string' && q.trim()) {
    const escaped = q.trim().replace(/[.*+?^$()|[\]{}\\]/g, '\\$&');
    filter.$or = ['name', 'shortDescription', 'description', 'ingredients'].map(field => ({ [field]: { $regex: escaped, $options: 'i' } }));
  }
  const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 });
  res.json({ success: true, count: products.length, data: products });
});
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, data: products });
});
function readProduct(publicOnly) {
  return asyncHandler(async (req, res) => {
    const product = await Product.findOne({ ...identifier(req.params.id), ...(publicOnly ? { status: 'ACTIVE' } : {}) });
    if (!product) { res.status(404); throw new Error('Product not found'); }
    res.json({ success: true, data: product });
  });
}
const getProductById = readProduct(true);
const getAdminProductById = readProduct(false);
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(productInput(req.body, res));
  res.status(201).json({ success: true, data: product });
});
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  const data = productInput(req.body, res);
  Object.assign(product, data);
  if (data.images) product.image = data.images[0] || "";
  await product.save();
  res.json({ success: true, data: product });
});
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, data: {} });
});
module.exports = { getProducts, getProductById, getAdminProducts, getAdminProductById, createProduct, updateProduct, deleteProduct };
