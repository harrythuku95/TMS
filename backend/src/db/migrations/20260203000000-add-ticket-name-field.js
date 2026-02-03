'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create sequence for ticket names
    await queryInterface.sequelize.query(
      'CREATE SEQUENCE IF NOT EXISTS tickets_name_seq START 1;'
    );

    // Add name column (initially nullable)
    await queryInterface.addColumn('tickets', 'name', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });

    // Backfill existing tickets with sequential names
    await queryInterface.sequelize.query(`
      UPDATE tickets
      SET name = 'T' || LPAD(nextval('tickets_name_seq')::text, 4, '0')
      WHERE name IS NULL;
    `);

    // Make column NOT NULL
    await queryInterface.changeColumn('tickets', 'name', {
      type: Sequelize.STRING(10),
      allowNull: false,
    });

    // Add unique constraint
    await queryInterface.addConstraint('tickets', {
      fields: ['name'],
      type: 'unique',
      name: 'tickets_name_unique'
    });

    // Add index for fast lookups
    await queryInterface.addIndex('tickets', ['name'], {
      name: 'tickets_name_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index
    await queryInterface.removeIndex('tickets', 'tickets_name_idx');

    // Remove unique constraint
    await queryInterface.removeConstraint('tickets', 'tickets_name_unique');

    // Remove column
    await queryInterface.removeColumn('tickets', 'name');

    // Drop sequence
    await queryInterface.sequelize.query(
      'DROP SEQUENCE IF EXISTS tickets_name_seq;'
    );
  }
};
