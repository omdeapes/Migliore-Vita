'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [results] = await queryInterface.sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'photographer_id'`
    );
    if (results.length === 0) {
      await queryInterface.addColumn('invoices', 'photographer_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('invoices', 'photographer_id');
  }
};
