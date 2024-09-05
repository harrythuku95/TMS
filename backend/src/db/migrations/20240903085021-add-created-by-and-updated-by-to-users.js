'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'createdById', {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'updatedById', {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'createdById');
    await queryInterface.removeColumn('users', 'updatedById');
  }
};