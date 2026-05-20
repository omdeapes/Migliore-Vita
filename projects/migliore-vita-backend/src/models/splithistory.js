'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SplitHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SplitHistory.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
    }
  }
  SplitHistory.init({
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
    changedBy: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'User ID or system',
    },
    oldPercentages: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Previous split percentages',
    },
    newPercentages: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'New split percentages',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When the new percentages take effect',
    },
  }, {
    sequelize,
    modelName: 'SplitHistory',
  });
  return SplitHistory;
};