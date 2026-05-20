// Test PostgreSQL connection using the pg library
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const testPostgres = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connected');

    // Drop the users table if it exists
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('✅ Users table dropped');

    // Create the users table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50)
      );
    `);
    console.log('✅ Users table created');

    // Insert a test user
    await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4);',
      ['Test User', 'test@example.com', 'password123', 'admin']
    );
    console.log('✅ Test user inserted');

    // Query the test user
    const res = await client.query('SELECT * FROM users;');
    console.log('✅ Users:', res.rows);

    console.log('✅ PostgreSQL test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Details:', error);
  } finally {
    if (client) client.release();
    await pool.end();
  }
};

testPostgres();