'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const closeRequests = await queryInterface.sequelize.query(
      `SELECT id from "closeRequest";`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const users = await queryInterface.sequelize.query(
      `SELECT id from users;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (closeRequests.length === 0 || users.length === 0) {
      console.log('No close requests or users found. Skipping CloseRequestApprovers seeding.');
      return;
    }

    await queryInterface.bulkInsert('CloseRequestApprovers', [
      {
        id: uuidv4(),
        closeRequestId: closeRequests[0].id,
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        closeRequestId: closeRequests.length > 1 ? closeRequests[1].id : closeRequests[0].id,
        userId: users.length > 1 ? users[1].id : users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CloseRequestApprovers', null, {});
  }
};