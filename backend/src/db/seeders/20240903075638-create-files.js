'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert('file', [
      {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        belongsTo: 'tickets',
        belongsToId: 'f9d12a36-6e4d-457f-b4e1-1b82f9ecb1b9', // This should match an existing ticket ID
        belongsToColumn: 'files',
        name: 'example_file.pdf',
        sizeInBytes: 1024000,
        privateUrl: '/uploads/private/example_file.pdf',
        publicUrl: '/uploads/public/example_file.pdf',
        createdById: '193bf4b5-9f07-4bd5-9a43-e7e41f3e96af', // This should match an existing user ID
        updatedById: '193bf4b5-9f07-4bd5-9a43-e7e41f3e96af', // This should match an existing user ID
        createdAt: now,
        updatedAt: now
      },
      {
        id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        belongsTo: 'tickets',
        belongsToId: 'a8d23b45-7f6e-4d5f-a7e3-2c92f8bdc2c8', // This should match an existing ticket ID
        belongsToColumn: 'files',
        name: 'another_file.jpg',
        sizeInBytes: 512000,
        privateUrl: '/uploads/private/another_file.jpg',
        publicUrl: '/uploads/public/another_file.jpg',
        createdById: '193bf4b5-9f07-4bd5-9a43-e7e41f3e96af', // This should match an existing user ID
        updatedById: '193bf4b5-9f07-4bd5-9a43-e7e41f3e96af', // This should match an existing user ID
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('file', null, {});
  }
};