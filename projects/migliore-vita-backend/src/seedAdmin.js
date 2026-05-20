require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/user');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.findOrCreate({
      where: { email: 'admin@migliore-vita.eg' },
      defaults: {
        name: 'Super Admin',
        email: 'admin@migliore-vita.eg',
        passwordHash: hashedPassword,
        role: 'admin',
        isActive: true
      }
    });

    console.log(adminUser[1] ? 'Admin user created successfully.' : 'Admin user already exists.');
    console.log('Email: admin@migliore-vita.eg');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}
seedAdmin();
