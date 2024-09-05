'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ticketLabels = [
      {
        id: '4a5b6c7d-8e9f-0123-4567-89abcdef0123',
        label_id: 'LABEL_001',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5b6c7d8e-9f01-2345-6789-abcd01234567',
        label_id: 'LABEL_002',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6c7d8e9f-0123-4567-89ab-cd0123456789',
        label_id: 'LABEL_003',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('ticket_labels', ticketLabels, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ticket_labels', null, {});
  },
};
