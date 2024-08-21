'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const attachments = [
      {
        id: 'e2d34c75-6d7e-48c4-8a8d-5b3bfbf8e1b8',
        attachment_id: 'ATTACHMENT_001',
        file_type: 'image/png',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'f3e45d86-7e8f-49f5-9a9e-6c4dcbf9f2d9',
        attachment_id: 'ATTACHMENT_002',
        file_type: 'application/pdf',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'g4f56e97-8f9f-4a0f-baba-7d5edcfafbda',
        attachment_id: 'ATTACHMENT_003',
        file_type: 'text/plain',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('attachments', attachments, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attachments', null, {});
  },
};
