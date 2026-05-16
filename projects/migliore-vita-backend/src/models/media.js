const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Media = sequelize.define('Media', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoiceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'invoices', key: 'id' },
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  mediaType: {
    type: DataTypes.ENUM('photo', 'video'),
    allowNull: false,
  },
  // S3 storage
  s3Key: {
    type: DataTypes.STRING(512),
    allowNull: true,
  },
  s3Url: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  // Google Drive
  googleDriveId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  googleDriveUrl: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  // Delivery
  uploadStatus: {
    type: DataTypes.ENUM('pending', 'uploading', 'uploaded', 'failed'),
    defaultValue: 'pending',
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deliveryChannel: {
    type: DataTypes.STRING(50),
    allowNull: true, // whatsapp, telegram, email
  },
}, {
  tableName: 'media',
  indexes: [
    { fields: ['invoice_id'] },
    { fields: ['upload_status'] },
  ],
});

module.exports = Media;
