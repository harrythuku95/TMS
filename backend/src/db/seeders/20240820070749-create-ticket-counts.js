'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ticketCounts = [
      {
        id: '7d8e9f01-2345-6789-abcd-0123456789ab',
        count_id: 'COUNT_001',
        count_type: 'open',
        count_value: 5,
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8e9f0123-4567-89ab-cd01-23456789abcd',
        count_id: 'COUNT_002',
        count_type: 'closed',
        count_value: 3,
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9f012345-6789-abcd-0123-456789abcdef',
        count_id: 'COUNT_003',
        count_type: 'pending',
        count_value: 7,
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('ticket_counts', ticketCounts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ticket_counts', null, {});
  },
};
