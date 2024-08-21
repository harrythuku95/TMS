'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const closeRequestApprovers = [
      {
        id: 'f1e2d3c4-5678-90ab-cdef-1234567890ab',
        closeRequestId: 'a1b2c3d4-5678-90ab-cdef-1234567890ab', // Replace with actual close request ID
        userId: '193bf4b5-9f07-4bd5-9a43-e7e41f3e96af', // Replace with actual user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'e2d3c4f5-6789-01ab-cdef-234567890abc',
        closeRequestId: 'b2c3d4e5-6789-01ab-cdef-234567890abc', // Replace with actual close request ID
        userId: 'af5a87be-8f9c-4630-902a-37a60b7005ba', // Replace with actual user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'd3c4f5e6-7890-12ab-cdef-34567890abcd',
        closeRequestId: 'c3d4e5f6-7890-12ab-cdef-34567890abcd', // Replace with actual close request ID
        userId: '5bc531ab-611f-41f3-9373-b7cc5d09c93d', // Replace with actual user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('CloseRequestApprovers', closeRequestApprovers, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CloseRequestApprovers', null, {});
  },
};
