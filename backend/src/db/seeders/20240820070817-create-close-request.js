'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const closeRequests = [
      {
        id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
        approved: false,
        number_of_approval_requests: 2,
        ticketId: '6a7b8c9d-0e1f-2345-6789-abcd01234567', // Replace with actual ticket IDs
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b2c3d4e5-6789-01ab-cdef-234567890abc',
        approved: true,
        number_of_approval_requests: 3,
        ticketId: '7b8c9d0e-1f23-4567-89ab-cd0123456789', // Replace with actual ticket IDs
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'c3d4e5f6-7890-12ab-cdef-34567890abcd',
        approved: false,
        number_of_approval_requests: 1,
        ticketId: '8c9d0e1f-2345-6789-abcd-0123456789ab', // Replace with actual ticket IDs
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('close_requests', closeRequests, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('close_requests', null, {});
  },
};
