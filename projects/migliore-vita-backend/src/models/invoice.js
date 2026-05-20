const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Invoice model — core transaction record
 * Serial number: tripid-photoid-sequence (generated on device, offline-safe)
 */
const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'trip_id', // Maps to snake_case column in the database
    references: { model: 'trips', key: 'id' },
  },
  photographerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'photographer_id', // Maps to snake_case column in the database
    references: { model: 'photographers', key: 'id' },
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'serial_number', // Maps to the snake_case column in the database
    comment: 'Format: TRIP-{DATE}-PHOTO-{ID}-{SEQUENCE}',
  },
  serialSequence: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Counter for this photographer on this trip',
  },
  guestName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  guestContact: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Phone, email, or Telegram handle',
  },
  guestHotel: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  guestRoom: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'EGP',
  },
  // Server timestamp (when synced)
  // createdAt / updatedAt are auto-managed by Sequelize
  
  // Device timestamp (when created offline)
  createdAtLocal: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp from photographer device (may differ from server time)',
  },
  syncedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'finalized', 'paid'),
    defaultValue: 'draft',
  },
  mediaCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  deviceId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Which device created this invoice',
  },
}, {
  tableName: 'invoices',
  underscored: true,
  indexes: [
    { fields: ['trip_id'] },
    { fields: ['photographer_id'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
    { unique: true, fields: ['trip_id', 'photographer_id', 'serial_sequence'] },
  ],
});

// Relationships
Invoice.associate = (models) => {
  Invoice.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
  Invoice.belongsTo(models.Photographer, { foreignKey: 'photographerId', as: 'photographer' });
  Invoice.hasMany(models.InvoiceSplit, { foreignKey: 'invoiceId', as: 'splits' });
  Invoice.hasMany(models.Media, { foreignKey: 'invoiceId', as: 'media' });
};

module.exports = Invoice;
