'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tickets = [
      {
        id: 'f9d12a36-6e4d-457f-b4e1-1b82f9ecb1b9',
        ticket_id: 'TICKET_001',
        subject: 'Ticket Subject 1',
        priority: 'High',
        description: 'Description for Ticket 1',
        status: 'pending',
        assigneeId: null,  // Replace with a valid user ID if necessary
        customerId: null,  // Replace with a valid customer ID if necessary
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'a8d23b45-7f6e-4d5f-a7e3-2c92f8bdc2c8',
        ticket_id: 'TICKET_002',
        subject: 'Ticket Subject 2',
        priority: 'Medium',
        description: 'Description for Ticket 2',
        status: 'in_progress',
        assigneeId: null,  // Replace with a valid user ID if necessary
        customerId: null,  // Replace with a valid customer ID if necessary
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'c7e34c56-8f7e-4e6f-b8f4-3d03f9fdc3d9',
        ticket_id: 'TICKET_003',
        subject: 'Ticket Subject 3',
        priority: 'Low',
        description: 'Description for Ticket 3',
        status: 'completed',
        assigneeId: null,  // Replace with a valid user ID if necessary
        customerId: null,  // Replace with a valid customer ID if necessary
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('tickets', tickets, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tickets', null, {});
  },
};
