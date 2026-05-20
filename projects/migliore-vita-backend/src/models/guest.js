'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Guest.hasMany(models.Invoice, { foreignKey: 'guestContact', sourceKey: 'contact', as: 'invoices' });
    }
  }
  Guest.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Phone, email, or Telegram handle',
    },
    hotel: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    faceEmbedding: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Facial recognition embedding vector',
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Guest',
  });
  return Guest;
};