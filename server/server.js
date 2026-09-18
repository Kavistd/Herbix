const { env, assertRequiredEnv } = require('./config/env');

assertRequiredEnv();

const connectDB = require('./config/db');
const app = require('./app');

async function start() {
  await connectDB();
  if (require('mongoose').connection.readyState === 1) {
    await require('./services/orderService').recoverInventory();
  }

  const server = app.listen(env.PORT, () => {
    console.log(`\n[server] Herbix API listening on http://localhost:${env.PORT}`);
    console.log(`[server] Environment: ${env.NODE_ENV}`);
    console.log(`[server] Health check: http://localhost:${env.PORT}/api/health\n`);
  });

  // Surface otherwise-silent crashes instead of letting the process hang or
  // die without explanation.
  process.on('unhandledRejection', (err) => {
    console.error(`[server] Unhandled promise rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

start();
