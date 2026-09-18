/**
 * Vercel serverless entry point.
 *
 * Vercel imports this file and calls the exported function for every
 * incoming request. We await connectDB() before handing off to Express
 * so the Mongoose connection is always established before any route runs.
 *
 * connectDB() is safe to call on every request:
 * - If already connected (readyState === 1) it returns immediately.
 * - If a connection attempt is already in flight it awaits the same promise.
 * - Only on a true cold start does it open a new connection.
 *
 * server.js is NOT imported here — app.listen() must never run in serverless.
 */
const connectDB = require('../config/db');
const app = require('../app');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
