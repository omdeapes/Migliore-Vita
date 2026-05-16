const express = require('express');
const router = express.Router();

// GET /v1/health — Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'migliore-vita-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// GET /v1/status — Detailed status (for monitoring)
router.get('/status', async (req, res) => {
  const { sequelize } = require('../config/database');
  let dbStatus = 'unknown';

  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  res.json({
    api: 'ok',
    database: dbStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

module.exports = router;
