'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // First, find and delete duplicate email entries, keeping only the most recent one
      await queryInterface.sequelize.query(`
        DELETE FROM users
        WHERE id NOT IN (
          SELECT DISTINCT ON (email) id
          FROM users
          WHERE "deletedAt" IS NULL
          ORDER BY email, "createdAt" DESC
        )
        AND "deletedAt" IS NULL;
      `, { transaction });

      // Remove the old constraint if it exists but wasn't properly applied
      try {
        await queryInterface.removeConstraint('users', 'users_email_key', { transaction });
      } catch (error) {
        // Constraint might not exist, continue
        console.log('Old constraint does not exist or already removed');
      }

      // Add the unique constraint to ensure no duplicate emails
      await queryInterface.addConstraint('users', {
        fields: ['email'],
        type: 'unique',
        name: 'users_email_unique_constraint',
        transaction
      });

      // Add index for better query performance on email lookups
      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'users_email_unique_index',
        transaction
      });

      await transaction.commit();
      console.log('Successfully enforced unique email constraint');
    } catch (error) {
      await transaction.rollback();
      console.error('Error enforcing unique email constraint:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove the index
      await queryInterface.removeIndex('users', 'users_email_unique_index', { transaction });

      // Remove the constraint
      await queryInterface.removeConstraint('users', 'users_email_unique_constraint', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
