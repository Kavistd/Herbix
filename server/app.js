const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { env } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// ---- Core middleware -------------------------------------------------
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ---- Health check ------------------------------------------------------
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.json({
    success: true,
    message: 'Herbix API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: dbStateNames[mongoose.connection.readyState] || 'unknown'
  });
});

// ---- API routes ----------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ---- 404 + centralized error handling (must be last) ---------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
