'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const customers = [
      {
        id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
        customer_id: 'CUSTOMER_001',
        name: 'Acme Corporation',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2b3c4d5e-6f7a-8901-bcde-f12345678901',
        customer_id: 'CUSTOMER_002',
        name: 'Globex Inc.',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3c4d5e6f-7a8b-9012-cdef-123456789012',
        customer_id: 'CUSTOMER_003',
        name: 'Soylent Corp.',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('customers', customers, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('customers', null, {});
  },
};
