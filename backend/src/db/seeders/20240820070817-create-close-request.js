'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tickets = await queryInterface.sequelize.query(
      `SELECT id from tickets LIMIT 2;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const users = await queryInterface.sequelize.query(
      `SELECT id from users LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (tickets.length === 0 || users.length === 0) {
      console.log('No tickets or users found. Skipping closeRequest seeding.');
      return;
    }

    await queryInterface.bulkInsert('closeRequest', [
      {
        id: uuidv4(),
        approved: false,
        number_of_approval_requests: 2,
        ticketId: tickets[0].id,
        createdById: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        approved: true,
        number_of_approval_requests: 3,
        ticketId: tickets[1].id,
        createdById: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('closeRequest', null, {});
  }
};