'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const webhooks = [
      {
        id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        webhook_id: 'WEB001',
        importHash: 'hash1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7',
        webhook_id: 'WEB002',
        importHash: 'hash2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'c3d4e5f6-g7h8-9i0j-1k2l-3m4n5o6p7q8r',
        webhook_id: 'WEB003',
        importHash: 'hash3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('webhooks', webhooks, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('webhooks', null, {});
  },
};
