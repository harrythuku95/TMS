'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const agents = [
      {
        id: '1a73a5e7-5c6d-4bcf-91e7-bc9aabef59f3',
        agent_id: 'agent_001',
        name: 'Agent One',
        role: 'Support Agent',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2b84b1e8-6d8f-4dc9-9872-2c99e5f579d5',
        agent_id: 'agent_002',
        name: 'Agent Two',
        role: 'Sales Agent',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3c95b2f9-7e9f-4edc-8f03-3db1e6f489d7',
        agent_id: 'agent_003',
        name: 'Agent Three',
        role: 'Technical Agent',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('agents', agents, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('agents', null, {});
  },
};
