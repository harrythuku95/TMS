'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const mailboxes = [
      {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        mailbox_id: 'MBX001',
        name: 'Support Inbox',
        type: 'Support',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        mailbox_id: 'MBX002',
        name: 'Sales Inbox',
        type: 'Sales',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        mailbox_id: 'MBX003',
        name: 'General Inquiries',
        type: 'General',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('mailboxes', mailboxes, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('mailboxes', null, {});
  },
};
