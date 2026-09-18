const mongoose = require('mongoose');
const { env } = require('./env');

// Cached promise — reused across warm serverless invocations so
// mongoose.connect() is never called more than once per container.
let connectionPromise = null;

/**
 * Connects to MongoDB via Mongoose.
 *
 * Safe for both traditional (server.js) and serverless (api/index.js) use:
 * - First call opens the connection and caches the promise.
 * - Subsequent calls on a warm container return immediately.
 * - Deliberately does NOT crash the process on failure so /api/health
 *   still responds with a useful diagnostic state.
 */
async function connectDB() {
  // Already connected — nothing to do.
  if (mongoose.connection.readyState === 1) return;

  // Connection attempt already in flight — wait for it.
  if (connectionPromise) return connectionPromise;

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log(`[db] Mongoose connected → ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[db] Mongoose connection error: ${err.message}`);
    // Allow a fresh attempt next request if this one failed.
    connectionPromise = null;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] Mongoose disconnected');
    connectionPromise = null;
  });

  connectionPromise = mongoose
    .connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .catch((err) => {
      connectionPromise = null;
      console.error(
        `[db] Initial connection attempt failed: ${err.message}\n` +
        `      Routes touching the database will fail until MongoDB is reachable.`
      );
    });

  return connectionPromise;
}

module.exports = connectDB;
