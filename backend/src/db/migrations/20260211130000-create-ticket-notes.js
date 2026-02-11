'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ticketNotes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      ticketId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdById: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add index on ticketId for performance
    await queryInterface.addIndex('ticketNotes', ['ticketId'], {
      name: 'ticket_notes_ticket_id_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('ticketNotes', 'ticket_notes_ticket_id_idx');
    await queryInterface.dropTable('ticketNotes');
  }
};
