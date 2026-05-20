'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceSplit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      InvoiceSplit.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
      InvoiceSplit.belongsTo(models.Photographer, { foreignKey: 'photographerId', as: 'photographer' });
      InvoiceSplit.belongsTo(models.Guide, { foreignKey: 'guideId', as: 'guide' });
    }
  }
  InvoiceSplit.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'invoice_id', // Maps to snake_case column in the database
      references: { model: 'invoices', key: 'id' },
    },
    photographerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'photographer_id', // Maps to snake_case column in the database
      references: { model: 'photographers', key: 'id' },
    },
    guideId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'guide_id', // Maps to snake_case column in the database
      references: { model: 'guides', key: 'id' },
    },
    centerId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Safari center ID (future use)',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Percentage of total invoice amount',
    },
  }, {
    sequelize,
    modelName: 'InvoiceSplit',
  });
  return InvoiceSplit;
};