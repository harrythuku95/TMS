'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id from users WHERE role = 'Admin' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const customers = await queryInterface.sequelize.query(
      `SELECT id from customers LIMIT 2;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || customers.length === 0) {
      console.log('No users or customers found. Skipping tickets seeding.');
      return;
    }

    return queryInterface.bulkInsert('tickets', [
      {
        id: uuidv4(),
        subject: 'Cannot access account',
        description: 'I am unable to log into my account. It says incorrect password.',
        status: 'open',
        priority: 'high',
        assigneeId: users[0].id,
        customerId: customers[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        subject: 'Feature request',
        description: 'Can we add a dark mode to the application?',
        status: 'open',
        priority: 'low',
        assigneeId: users[0].id,
        customerId: customers[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tickets', null, {});
  }
};