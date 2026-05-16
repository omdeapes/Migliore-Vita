const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'accountant', 'support', 'photographer'),
    allowNull: false,
    defaultValue: 'support',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.passwordHash && !user.passwordHash.startsWith('$2b$')) {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
      }
    },
  },
});

// Instance method to verify password
User.prototype.checkPassword = async function(plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Class method to find by email (for login)
User.findByEmail = async function(email) {
  return User.findOne({ where: { email: email.toLowerCase(), isActive: true } });
};

module.exports = User;
