/**
 * One-off database seeding script.
 *
 * Usage (from server/):
 *   npm run seed            → inserts the product catalog + admin user
 *   npm run seed:destroy    → removes seeded products + admin user
 *
 * Requires MongoDB to be reachable at MONGODB_URI and, for the admin
 * account, ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD set in server/.env.
 */
const mongoose = require('mongoose');
const { env, assertRequiredEnv } = require('../config/env');
const Product = require('../models/Product');
const User = require('../models/User');
const { products } = require('./seedData');

assertRequiredEnv();

async function run() {
  await mongoose.connect(env.MONGODB_URI);
  console.log(`[seed] Connected → ${mongoose.connection.name}`);

  const destroy = process.argv.includes('--destroy');

  if (destroy) {
    await Product.deleteMany({ slug: { $in: products.map((p) => p.slug) } });
    if (env.ADMIN_EMAIL) {
      await User.deleteOne({ email: env.ADMIN_EMAIL.toLowerCase() });
    }
    console.log('[seed] Seeded products and admin user removed.');
    return mongoose.disconnect();
  }

  // Insert missing products only: reruns never overwrite admin edits or inventory.
  for (const product of products) {
    await Product.findOneAndUpdate({ slug: product.slug }, { $setOnInsert: product }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true
    });
  }
  console.log(`[seed] Upserted ${products.length} product(s).`);

  if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
    const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
    if (existingAdmin) {
      console.log(`[seed] Admin user already exists (${env.ADMIN_EMAIL}) — skipped.`);
    } else {
      await User.create({
        name: env.ADMIN_NAME || 'Herbix Admin',
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD, // hashed automatically by the User model's pre-save hook
        role: 'ADMIN'
      });
      console.log(`[seed] Admin user created (${env.ADMIN_EMAIL}).`);
    }
  } else {
    console.log('[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipped admin user creation.');
  }

  await mongoose.disconnect();
  console.log('[seed] Done.');
}

run().catch((err) => {
  console.error(`[seed] Failed: ${err.message}`);
  process.exit(1);
});
