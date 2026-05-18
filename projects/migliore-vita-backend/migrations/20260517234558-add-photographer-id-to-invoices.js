'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('invoices', 'photographer_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if the column is required
      references: {
        model: 'photographers', // Assumes a 'photographers' table exists
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('invoices', 'photographer_id');
  }
};
