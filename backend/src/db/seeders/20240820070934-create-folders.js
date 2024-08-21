'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const folders = [
      {
        id: '7b8e9f10-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
        folder_id: 'FDL001',
        name: 'Project Documents',
        description: 'Folder for storing project-related documents',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8c9d0e1f-2a3b-4c5d-6e7f-8g9h0i1j2k3l',
        folder_id: 'FDL002',
        name: 'User Data',
        description: 'Folder for storing user data files',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9e0f1g2h-3a4b-5c6d-7e8f-9g0h1i2j3k4l',
        folder_id: 'FDL003',
        name: 'System Backups',
        description: 'Folder for storing system backup files',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('folders', folders, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('folders', null, {});
  },
};
