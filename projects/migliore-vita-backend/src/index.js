require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { connectDatabase } = require('./config/database');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

// Routes
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const photographerRoutes = require('./routes/photographer');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security Middleware ────────────────────────────────────────────────────

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/v1', limiter);

// ── Body parsing ────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────────────────────────────────────────

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));
}

// ── Routes ───────────────────────────────────────────────────────────────────

app.use('/v1', healthRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1', photographerRoutes);    // /v1/trips, /v1/invoices, /v1/sync, /v1/media
app.use('/v1/admin', adminRoutes);     // /v1/admin/*  (JWT + role required)

// ── Error handler ─────────────────────────────────────────────────────────────

app.use(errorHandler);

// ── 404 ───────────────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Start ─────────────────────────────────────────────────────────────────────

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      logger.info(`🚀 Migliore Vita API running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = app; // For testing
