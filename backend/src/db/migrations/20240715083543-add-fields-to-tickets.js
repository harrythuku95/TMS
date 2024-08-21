'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tickets', 'subject', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.addColumn('tickets', 'priority', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.addColumn('tickets', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn('tickets', 'status', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'pending',
    });

    await queryInterface.addColumn('tickets', 'assigneeId', {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,
    });

    await queryInterface.addColumn('tickets', 'customerId', {
      type: Sequelize.UUID,
      references: {
        model: 'customers',
        key: 'id',
      },
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tickets', 'subject');
    await queryInterface.removeColumn('tickets', 'priority');
    await queryInterface.removeColumn('tickets', 'description');
    await queryInterface.removeColumn('tickets', 'status');
    await queryInterface.removeColumn('tickets', 'assigneeId');
    await queryInterface.removeColumn('tickets', 'customerId');
  },
};
