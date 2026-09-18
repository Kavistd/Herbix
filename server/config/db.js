const mongoose = require('mongoose');
const { env } = require('./env');

/**
 * Connects to MongoDB via Mongoose.
 *
 * Deliberately does NOT crash the whole process if the initial connection
 * fails — Express still starts and /api/health still responds, which is
 * far easier to diagnose than a silently-dead server. Mongoose will keep
 * retrying in the background per its default behavior, and the listeners
 * below report state changes to the console.
 */
async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log(`[db] Mongoose connected → ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[db] Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] Mongoose disconnected');
  });

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
  } catch (err) {
    console.error(
      `[db] Initial connection attempt failed: ${err.message}\n` +
      `      The API will keep running, but any route touching the database will fail ` +
      `until MongoDB is reachable at MONGODB_URI.`
    );
  }
}

module.exports = connectDB;
