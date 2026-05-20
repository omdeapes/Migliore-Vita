// Test database connection and table creation
const { sequelize } = require('./src/config/database');

const testDatabase = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Drop the users table if it exists
    await sequelize.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('✅ Users table dropped');

    // Create the users table
    await sequelize.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Insert a test user
    await sequelize.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4);',
      { bind: ['Test User', 'test@example.com', 'password123', 'admin'] }
    );
    console.log('✅ Test user inserted');

    console.log('✅ Database test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Details:', error);
  } finally {
    await sequelize.close();
  }
};

testDatabase();