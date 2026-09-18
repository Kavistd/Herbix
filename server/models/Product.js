const mongoose = require('mongoose');

/**
 * Mirrors the shape already used by the frontend (src/data/products.js) so
 * that once the frontend is wired to the API, product cards/detail pages
 * need no restructuring — only the data source changes.
 */
const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase hyphen-separated slug']
    },
    name: { type: String, required: true, trim: true },
    orderReservations: { type: [{ _id: false, order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, quantity: Number }], default: [], select: false },
    restoredLegacyOrders: { type: [mongoose.Schema.Types.ObjectId], default: [], select: false },
    subtitle: { type: String, trim: true },
    tagline: { type: String, trim: true },
    image: { type: String, trim: true },

    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0, default: null },
    currency: { type: String, default: 'LKR' },

    bitesCount: { type: Number, min: 1, default: null },
    unit: { type: String, trim: true },
    unitCost: { type: String, trim: true },

    rating: { type: Number, min: 0, max: 5, default: null },
    reviewsCount: { type: Number, default: 0 },

    badge: { type: String, trim: true },
    badgeVariant: { type: String, trim: true },
    category: { type: String, trim: true, index: true },
    accentColor: { type: String, trim: true },

    // Legacy fields remain readable; status/stock/isComingSoon govern sales.
    isAvailable: { type: Boolean, default: true },
    shortDescription: { type: String, trim: true, default: '' },
    stock: { type: Number, min: 0, default: 0, validate: [Number.isSafeInteger, 'Stock must be a whole number'] },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'INACTIVE', index: true },
    featured: { type: Boolean, default: false },
    isComingSoon: { type: Boolean, default: false },

    description: { type: String, trim: true },
    features: { type: [String], default: [] },
    ingredients: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
