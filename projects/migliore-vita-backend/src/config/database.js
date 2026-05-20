const { Sequelize } = require('sequelize');
const logger = require('./logger');

console.log('DB Config:', {
  name: process.env.DB_NAME || 'migliore_vita',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD ? '***' : 'empty',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432'
});

const sequelize = new Sequelize(
  process.env.DB_NAME || 'migliore_vita',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true, // snake_case column names
      timestamps: true,
      paranoid: false,
    },
  }
);

async function connectDatabase() {
  await sequelize.authenticate();
  logger.info('PostgreSQL connected successfully');

  if (process.env.NODE_ENV === 'development') {
    // Check if tables exist
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'trips', 'invoices', 'media');"
    );
    
    if (results.length === 0) {
      // Sync in development only - NEVER in production
      await sequelize.sync({ alter: false });
      logger.info('Database synced (development)');
    } else {
      logger.info('Tables already exist, skipping sync');
    }
  }
}

module.exports = { sequelize, connectDatabase };
