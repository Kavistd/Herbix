/**
 * Centralized environment configuration.
 * Loads .env once and exposes validated values — nothing sensitive is
 * ever hardcoded here, only fallback values for non-sensitive settings.
 */
require('dotenv').config();

const required = ['MONGODB_URI', 'JWT_SECRET'];

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
};

// Fail fast (with a clear message) if critical secrets are missing —
// better than a confusing crash deep inside mongoose or jsonwebtoken.
function assertRequiredEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `\n[config] Missing required environment variable(s): ${missing.join(', ')}\n` +
      `Copy server/.env.example to server/.env and fill in real values.\n`
    );
    process.exit(1);
  }
}

module.exports = { env, assertRequiredEnv };
