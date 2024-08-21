'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const messages = [
      {
        id: '4a5b6c7d-8e9f-0g1h-2i3j-4k5l6m7n8o9p',
        message_id: 'MSG001',
        subject: 'Welcome to our Service',
        body: 'Thank you for choosing our service. We are here to assist you with any queries you may have.',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5b6c7d8e-9f0g-1h2i-3j4k-5l6m7n8o9p0q',
        message_id: 'MSG002',
        subject: 'Account Activation',
        body: 'Please click the link below to activate your account. If you did not request this, please ignore this message.',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6c7d8e9f-0g1h-2i3j-4k5l-6m7n8o9p0q1r',
        message_id: 'MSG003',
        subject: 'Password Reset Request',
        body: 'We received a request to reset your password. If this was not you, please contact support immediately.',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('messages', messages, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('messages', null, {});
  },
};
