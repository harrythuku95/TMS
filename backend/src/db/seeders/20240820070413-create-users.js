'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: '193bf4b5-9f07-4bd5-9a43-e7e41f3e96af',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@flatlogic.com',
        password: '$2b$12$H/t5QcMjXuB9pKW8Go3Bm.rfeQXJ7k6aeNNvXRvN6G4utn1BapRqq', // bcrypt hashed password
        emailVerified: true,
        disabled: false,
        provider: 'local',
        app_roleId: '55dfa666-48dd-46d9-83f8-f2caee56695e',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'af5a87be-8f9c-4630-902a-37a60b7005ba',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: '$2b$12$H/t5QcMjXuB9pKW8Go3Bm.rfeQXJ7k6aeNNvXRvN6G4utn1BapRqq', // bcrypt hashed password
        emailVerified: true,
        disabled: false,
        provider: 'local',
        app_roleId: 'ff54ec3e-73c9-43b5-b091-39ad9e18f4a4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5bc531ab-611f-41f3-9373-b7cc5d09c93d',
        firstName: 'Client',
        lastName: 'Hello',
        email: 'client@hello.com',
        password: '$2b$12$H/t5QcMjXuB9pKW8Go3Bm.rfeQXJ7k6aeNNvXRvN6G4utn1BapRqq', // bcrypt hashed password
        emailVerified: true,
        disabled: false,
        provider: 'local',
        app_roleId: 'ff54ec3e-73c9-43b5-b091-39ad9e18f4a4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
