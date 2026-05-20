require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/user');

async function fix() {
  try {
    await sequelize.authenticate();
    const hash = await bcrypt.hash('admin123', 12);
    // Use the model to update, but bypass the hook
    await User.update({ passwordHash: hash }, { 
      where: { email: 'admin@migliore-vita.eg' },
      hooks: false 
    });
    console.log('Password fixed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing password:', error);
    process.exit(1);
  }
}
fix();
