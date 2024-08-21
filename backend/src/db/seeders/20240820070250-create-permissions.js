'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        id: '818047c2-bcff-4fd2-9e94-44de1ca46f0f',
        name: 'CREATE_USERS',
        description: 'Allows creating new users',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'f3ba3122-b78f-45ee-af78-461e957e549a',
        name: 'READ_USERS',
        description: 'Allows reading user information',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'dfdb3c8f-daa5-44e4-9226-f2c738afb4d1',
        name: 'UPDATE_USERS',
        description: 'Allows updating existing users',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'e4de169e-2667-4d01-af96-e337a5dad721',
        name: 'DELETE_USERS',
        description: 'Allows deleting users',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9811a080-4c1b-4add-b372-3d26287b4e4d',
        name: 'CREATE_ROLES',
        description: 'Allows creating new roles',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7d0db44d-ca10-4824-abde-f1785ee90ee9',
        name: 'READ_ROLES',
        description: 'Allows reading role information',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '01cc66ce-fa2f-44ea-8d09-061d2fb9893a',
        name: 'UPDATE_ROLES',
        description: 'Allows updating existing roles',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '1b187017-26a8-4a5c-ae98-a3783c1bc4e2',
        name: 'DELETE_ROLES',
        description: 'Allows deleting roles',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6421d320-15e3-4668-8c40-1986595059a4',
        name: 'CREATE_PERMISSIONS',
        description: 'Allows creating new permissions',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '76145b26-04ef-4c6f-a464-02361e4ec5da',
        name: 'READ_PERMISSIONS',
        description: 'Allows reading permission information',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '843c2e01-11f6-4d79-a847-c84867e9a650',
        name: 'UPDATE_PERMISSIONS',
        description: 'Allows updating existing permissions',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6f2c3e2f-845e-44d0-aa7d-43bc2aa0ceaa',
        name: 'DELETE_PERMISSIONS',
        description: 'Allows deleting permissions',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('permissions', permissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
