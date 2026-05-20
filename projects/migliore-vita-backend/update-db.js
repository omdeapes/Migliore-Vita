// Update the users table to rename the password column to password_hash
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test data
const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { name: 'Regular User', email: 'user@example.com', password: 'user123', role: 'user' }
];

const trips = [
  { userId: 1, destination: 'Paris', startDate: '2023-10-01', endDate: '2023-10-10', status: 'completed' },
  { userId: 2, destination: 'Tokyo', startDate: '2023-11-01', endDate: '2023-11-10', status: 'upcoming' }
];

const invoices = [
  { userId: 1, tripId: 1, amount: 1000.00, status: 'paid', dueDate: '2023-10-15' },
  { userId: 2, tripId: 2, amount: 1500.00, status: 'pending', dueDate: '2023-11-15' }
];

const media = [
  { userId: 1, tripId: 1, url: 'http://example.com/photo1.jpg', type: 'image' },
  { userId: 2, tripId: 2, url: 'http://example.com/photo2.jpg', type: 'image' }
];

const updateDatabase = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connected');

    // Check if the password column exists
    const { rows } = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password'"
    );

    if (rows.length > 0) {
      // Rename the password column to password_hash
      await client.query('ALTER TABLE users RENAME COLUMN password TO password_hash;');
      console.log('✅ Renamed password column to password_hash');
    } else {
      console.log('✅ password_hash column already exists');
    }

    // Check if the is_active column exists
    const { rows: activeRows } = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active'"
    );

    if (activeRows.length === 0) {
      // Add the is_active column
      await client.query('ALTER TABLE users ADD COLUMN "is_active" BOOLEAN DEFAULT TRUE;');
      console.log('✅ Added is_active column');
    } else {
      console.log('✅ is_active column already exists');
    }

    // Drop tables if they exist
    await client.query('DROP TABLE IF EXISTS media CASCADE;');
    await client.query('DROP TABLE IF EXISTS invoices CASCADE;');
    await client.query('DROP TABLE IF EXISTS trips CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('✅ Tables dropped');

    // Create users table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        role VARCHAR(50),
        "is_active" BOOLEAN DEFAULT TRUE,
        "last_login" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Log current schema of trips and invoices
    const tripsSchema = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'trips'");
    console.log('✅ Current trips schema:', tripsSchema.rows.map(row => row.column_name));
    
    const invoicesSchema = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices'");
    console.log('✅ Current invoices schema:', invoicesSchema.rows.map(row => row.column_name));

    // Check and add missing columns to trips
    const tripsColumns = tripsSchema.rows.map(row => row.column_name);
    if (!tripsColumns.includes('trip_date')) {
      await client.query('ALTER TABLE trips ADD COLUMN trip_date DATE;');
      console.log('✅ Added trip_date column to trips');
    }
    
    // Check and add missing columns to invoices
    const invoicesColumns = invoicesSchema.rows.map(row => row.column_name);
    if (!invoicesColumns.includes('trip_id')) {
      await client.query('ALTER TABLE invoices RENAME COLUMN "tripId" TO trip_id;');
      console.log('✅ Renamed tripId to trip_id in invoices');
    }

    // Create trips table (if not exists)
    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        destination VARCHAR(255),
        "startDate" DATE,
        "endDate" DATE,
        status VARCHAR(50),
        trip_date DATE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Trips table created/verified');

    // Create invoices table (if not exists)
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        trip_id INTEGER REFERENCES trips(id),
        amount DECIMAL(10, 2),
        status VARCHAR(50),
        "dueDate" DATE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Invoices table created/verified');

    // Create media table
    await client.query(`
      CREATE TABLE media (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "tripId" INTEGER REFERENCES trips(id),
        url VARCHAR(255),
        type VARCHAR(50),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Media table created');

    // Seed users
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      await client.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4);',
        [user.name, user.email, hashedPassword, user.role]
      );
    }
    console.log('✅ Users seeded');

    // Seed trips
    for (const trip of trips) {
      await client.query(
        'INSERT INTO trips ("userId", destination, "startDate", "endDate", status) VALUES ($1, $2, $3, $4, $5);',
        [trip.userId, trip.destination, trip.startDate, trip.endDate, trip.status]
      );
    }
    console.log('✅ Trips seeded');

    // Seed invoices
    for (const invoice of invoices) {
      await client.query(
        'INSERT INTO invoices ("userId", "tripId", amount, status, "dueDate") VALUES ($1, $2, $3, $4, $5);',
        [invoice.userId, invoice.tripId, invoice.amount, invoice.status, invoice.dueDate]
      );
    }
    console.log('✅ Invoices seeded');

    // Seed media
    for (const medium of media) {
      await client.query(
        'INSERT INTO media ("userId", "tripId", url, type) VALUES ($1, $2, $3, $4);',
        [medium.userId, medium.tripId, medium.url, medium.type]
      );
    }
    console.log('✅ Media seeded');

    console.log('✅ Database updated successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Details:', error);
  } finally {
    if (client) client.release();
    await pool.end();
  }
};

updateDatabase();