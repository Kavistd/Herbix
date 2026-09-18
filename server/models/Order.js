const mongoose = require('mongoose');
const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
const text = { type: String, trim: true };
const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { ...text, required: true },
  image: { ...text, default: '' },
  quantity: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  unitPrice: { type: Number, required: true, min: 0 },
  itemTotal: { type: Number, required: true, min: 0 },
  price: Number // historical snapshots
}, { _id: false });
const orderSchema = new mongoose.Schema({
  orderNumber: { ...text, required: true, unique: true },
  customer: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { ...text, required: true },
    email: { ...text, required: true, lowercase: true, match: /^\S+@\S+\.\S+$/ },
    phone: { ...text, required: true },
    // Preserve legacy addresses for old order reads.
    firstName: text, lastName: text, address: text, city: text, district: text, postalCode: text
  },
  items: { type: [itemSchema], validate: [items => items.length > 0, 'Order items are required'] },
  shippingAddress: {
    firstName: { ...text, required: true }, lastName: { ...text, required: true },
    address: { ...text, required: true }, city: { ...text, required: true },
    district: { ...text, required: true }, postalCode: { ...text, required: true }
  },
  deliveryMethod: { type: String, enum: ['standard', 'pickup'], required: true },
  paymentMethod: { type: String, enum: ['cod', 'card'], required: true }, // card retained for historical records only
  paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'PENDING' },
  orderStatus: { type: String, enum: ORDER_STATUSES, default: 'PENDING', index: true },
  subtotal: { type: Number, min: 0, required: true },
  deliveryFee: { type: Number, min: 0, required: true },
  discount: { type: Number, min: 0, default: 0 },
  total: { type: Number, min: 0, required: true },
  couponCode: { ...text, default: null },
  statusHistory: [{ _id: false, status: { type: String, enum: ORDER_STATUSES }, at: { type: Date, default: Date.now }, by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  // Durable inventory progress permits recovery without MongoDB replica-set requirements.
  stockState: { type: String, enum: ['RESERVING', 'DEDUCTED', 'RESTORING', 'RESTORED'] },
  inventoryVersion: Number,
  checkoutKey: { type: String, select: false },
  requestHash: { type: String, select: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // legacy ownership
  status: String,
  discountAmount: Number
}, { timestamps: true });
orderSchema.index({ 'customer.user': 1, createdAt: -1 });
orderSchema.index({ checkoutKey: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
module.exports.PAYMENT_STATUSES = PAYMENT_STATUSES;
