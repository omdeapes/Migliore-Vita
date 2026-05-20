// seed.js
// Database seed script for Migliore Vita Backend

const { sequelize, connectDatabase } = require('./src/config/database');
const User = require('./src/models/user');
const Trip = require('./src/models/trip');
const Invoice = require('./src/models/invoice');
const Media = require('./src/models/media');

// Test data
const users = [
  {
    id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    role: 'admin',
    phone: '+1234567890',
    telegramHandle: '@admin',
    status: 'active',
  },
  {
    id: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    role: 'photographer',
    phone: '+1987654321',
    telegramHandle: '@johndoe',
    status: 'active',
  },
];

const trips = [
  {
    id: 'c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0',
    tripDate: '2026-05-15',
    safariCenter: 'Cairo Safari',
    guideId: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9', // John Doe
    guideName: 'John Doe',
    status: 'completed',
    createdByAdminId: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8', // Admin User
  },
  {
    id: 'd4e5f6g7-h8i9-0123-j4k5-l6m7n8o9p0q1',
    tripDate: '2026-05-16',
    safariCenter: 'Giza Safari',
    guideId: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9', // John Doe
    guideName: 'John Doe',
    status: 'completed',
    createdByAdminId: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8', // Admin User
  },
];

const invoices = [
  {
    id: 'e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2',
    tripId: 'c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0', // Cairo Safari
    photographerId: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9', // John Doe
    serialNumber: 'TRIP-20260515-PHOTO-1-1',
    serialSequence: 1,
    guestName: 'Alice Smith',
    guestContact: '+1234567890',
    guestHotel: 'Nile Ritz Carlton',
    guestRoom: '101',
    totalAmount: 350.00,
    currency: 'EGP',
    status: 'paid',
    mediaCount: 5,
  },
  {
    id: 'f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3',
    tripId: 'd4e5f6g7-h8i9-0123-j4k5-l6m7n8o9p0q1', // Giza Safari
    photographerId: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9', // John Doe
    serialNumber: 'TRIP-20260516-PHOTO-1-1',
    serialSequence: 1,
    guestName: 'Bob Johnson',
    guestContact: '+1987654321',
    guestHotel: 'Four Seasons Cairo',
    guestRoom: '202',
    totalAmount: 450.50,
    currency: 'EGP',
    status: 'paid',
    mediaCount: 3,
  },
];

const media = [
  {
    id: 'g7h8i9j0-k1l2-3456-m7n8-o9p0q1r2s3t4',
    invoiceId: 'e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2', // Alice Smith
    fileName: 'alice_smith_1.jpg',
    fileSize: 2048,
    mediaType: 'photo',
    s3Key: 'media/alice_smith_1.jpg',
    s3Url: 'https://s3.example.com/media/alice_smith_1.jpg',
    uploadStatus: 'uploaded',
    deliveredAt: new Date(),
    deliveryChannel: 'whatsapp',
  },
  {
    id: 'h8i9j0k1-l2m3-4567-n8o9-p0q1r2s3t4u5',
    invoiceId: 'e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2', // Alice Smith
    fileName: 'alice_smith_2.jpg',
    fileSize: 3072,
    mediaType: 'photo',
    s3Key: 'media/alice_smith_2.jpg',
    s3Url: 'https://s3.example.com/media/alice_smith_2.jpg',
    uploadStatus: 'uploaded',
    deliveredAt: new Date(),
    deliveryChannel: 'telegram',
  },
  {
    id: 'i9j0k1l2-m3n4-5678-o9p0-q1r2s3t4u5v6',
    invoiceId: 'f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3', // Bob Johnson
    fileName: 'bob_johnson_1.jpg',
    fileSize: 2560,
    mediaType: 'photo',
    s3Key: 'media/bob_johnson_1.jpg',
    s3Url: 'https://s3.example.com/media/bob_johnson_1.jpg',
    uploadStatus: 'uploaded',
    deliveredAt: new Date(),
    deliveryChannel: 'email',
  },
];

// Load environment variables
require('dotenv').config();

// Seed the database
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDatabase();
    console.log('Database connected');

    // Drop tables if they exist
    await sequelize.query('DROP TABLE IF EXISTS media CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS invoices CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS trips CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('Tables dropped');

    // Create users table
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
    console.log('Users table created');

    // Create trips table
    await sequelize.query(`
      CREATE TABLE trips (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        destination VARCHAR(255),
        "startDate" DATE,
        "endDate" DATE,
        status VARCHAR(50),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Trips table created');

    // Create invoices table
    await sequelize.query(`
      CREATE TABLE invoices (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "tripId" INTEGER REFERENCES trips(id),
        amount DECIMAL(10, 2),
        status VARCHAR(50),
        "dueDate" DATE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Invoices table created');

    // Create media table
    await sequelize.query(`
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
    console.log('Media table created');

    // Seed users using parameterized queries
    for (const user of users) {
      await sequelize.query(
        'INSERT INTO users (name, email, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW());',
        { bind: [user.name, user.email, user.password, user.role] }
      );
    }
    console.log('Users seeded');

    // Seed trips using parameterized queries
    for (const trip of trips) {
      await sequelize.query(
        'INSERT INTO trips ("userId", destination, "startDate", "endDate", status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW());',
        { bind: [trip.userId, trip.destination, trip.startDate, trip.endDate, trip.status] }
      );
    }
    console.log('Trips seeded');

    // Seed invoices using parameterized queries
    for (const invoice of invoices) {
      await sequelize.query(
        'INSERT INTO invoices ("userId", "tripId", amount, status, "dueDate", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW());',
        { bind: [invoice.userId, invoice.tripId, invoice.amount, invoice.status, invoice.dueDate] }
      );
    }
    console.log('Invoices seeded');

    // Seed media using parameterized queries
    for (const medium of media) {
      await sequelize.query(
        'INSERT INTO media ("userId", "tripId", url, type, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW());',
        { bind: [medium.userId, medium.tripId, medium.url, medium.type] }
      );
    }
    console.log('Media seeded');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    console.error('Error details:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();