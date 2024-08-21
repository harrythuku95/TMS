'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ticketCounts = [
      {
        id: '7d8e9f01-2345-6789-abcd-0123456789ab',
        count_id: 'COUNT_001',
        count_type: 'open',
        count_value: 5,
        ticketId: '6a7b8c9d-0e1f-2345-6789-abcd01234567', // Replace with actual ticket IDs
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8e9f0123-4567-89ab-cd01-23456789abcd',
        count_id: 'COUNT_002',
        count_type: 'closed',
        count_value: 3,
        ticketId: '7b8c9d0e-1f23-4567-89ab-cd0123456789', // Replace with actual ticket IDs
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9f012345-6789-abcd-0123-456789abcdef',
        count_id: 'COUNT_003',
        count_type: 'pending',
        count_value: 7,
        ticketId: '8c9d0e1f-2345-6789-abcd-0123456789ab', // Replace with actual ticket IDs
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
