'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('customers', [
      {
        id: uuidv4(),
        customer_id: 'CUST001',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1234567890',
        address: '123 Acme St, Acme City, AC 12345',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        customer_id: 'CUST002',
        name: 'Globex Inc.',
        email: 'info@globex.com',
        phone: '+1987654321',
        address: '456 Globex Ave, Globex Town, GT 67890',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('customers', null, {});
  }
};