const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tripDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  safariCenter: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  guideId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'guide_id', // Maps to snake_case column in the database
  },
  guideName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdByAdminId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  tableName: 'trips',
  indexes: [
    { fields: ['trip_date'] },
    { fields: ['status'] },
  ],
});

// Relationships
Trip.associate = (models) => {
  Trip.hasMany(models.Invoice, { foreignKey: 'tripId', as: 'invoices' });
  Trip.hasMany(models.Expense, { foreignKey: 'tripId', as: 'expenses' });
  if (models.Guide) {
    Trip.belongsTo(models.Guide, { foreignKey: 'guideId', as: 'guide' });
  }
  Trip.belongsToMany(models.User, { through: 'trip_photographers', as: 'photographers', foreignKey: 'tripId', otherKey: 'photographerId' });
};

module.exports = Trip;
