'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('file', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      belongsTo: {
        type: Sequelize.STRING(255),
      },
      belongsToId: {
        type: Sequelize.UUID,
      },
      belongsToColumn: {
        type: Sequelize.STRING(255),
      },
      name: {
        type: Sequelize.STRING(2083),
        allowNull: false,
      },
      sizeInBytes: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      privateUrl: {
        type: Sequelize.STRING(2083),
        allowNull: true,
      },
      publicUrl: {
        type: Sequelize.STRING(2083),
        allowNull: false,
      },
      createdById: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      updatedById: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('file');
  }
};