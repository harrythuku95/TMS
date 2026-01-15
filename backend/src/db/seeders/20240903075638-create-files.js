'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const adminUser = await queryInterface.sequelize.query(
      `SELECT id from "users" WHERE email = 'admin@example.com' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const adminId = adminUser[0].id;
    await queryInterface.bulkInsert('file', [
      {
        id: uuidv4(),
        belongsTo: 'tickets',
        belongsToId: 'f9d12a36-6e4d-457f-b4e1-1b82f9ecb1b9', // This should match an existing ticket ID
        belongsToColumn: 'files',
        name: 'example_file.pdf',
        sizeInBytes: 1024000,
        privateUrl: '/uploads/private/example_file.pdf',
        publicUrl: '/uploads/public/example_file.pdf',
        createdById: adminId, // This should match an existing user ID
        updatedById: adminId, // This should match an existing user ID
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        belongsTo: 'tickets',
        belongsToId: 'a8d23b45-7f6e-4d5f-a7e3-2c92f8bdc2c8', // This should match an existing ticket ID
        belongsToColumn: 'files',
        name: 'another_file.jpg',
        sizeInBytes: 512000,
        privateUrl: '/uploads/private/another_file.jpg',
        publicUrl: '/uploads/public/another_file.jpg',
        createdById: adminId, // This should match an existing user ID
        updatedById: adminId, // This should match an existing user ID
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('file', null, {});
  }
};