'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      {
        id: '55dfa666-48dd-46d9-83f8-f2caee56695e',
        name: 'Administrator',
        role_customization: 'Full access to all system features',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ff54ec3e-73c9-43b5-b091-39ad9e18f4a4',
        name: 'User',
        role_customization: 'Limited access to assigned features',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'c8767df1-d5f1-4035-abc6-8a1b4a5b4c41',
        name: 'Agent',
        role_customization: 'Access to manage and resolve tickets',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('roles', roles, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
