module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Creating the users table first to ensure it exists before being referenced
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          firstName: {
            type: Sequelize.DataTypes.TEXT,
          },
          lastName: {
            type: Sequelize.DataTypes.TEXT,
          },
          phoneNumber: {
            type: Sequelize.DataTypes.TEXT,
          },
          email: {
            type: Sequelize.DataTypes.TEXT,
          },
          disabled: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          password: {
            type: Sequelize.DataTypes.TEXT,
          },
          emailVerified: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          emailVerificationToken: {
            type: Sequelize.DataTypes.TEXT,
          },
          emailVerificationTokenExpiresAt: {
            type: Sequelize.DataTypes.DATE,
          },
          passwordResetToken: {
            type: Sequelize.DataTypes.TEXT,
          },
          passwordResetTokenExpiresAt: {
            type: Sequelize.DataTypes.DATE,
          },
          provider: {
            type: Sequelize.DataTypes.TEXT,
          },
          importHash: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          createdAt: { type: Sequelize.DataTypes.DATE },
          updatedAt: { type: Sequelize.DataTypes.DATE },
          deletedAt: { type: Sequelize.DataTypes.DATE },
        },
        { transaction }
      );

      await transaction.commit();

      // Start a new transaction for the rest of the tables
      const newTransaction = await queryInterface.sequelize.transaction();

      // Creating other tables
      await queryInterface.createTable(
        'roles',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          name: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          role_customization: {
            type: Sequelize.DataTypes.TEXT,
          },
          importHash: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          deletedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
          },
        },
        { transaction: newTransaction }
      );

      await queryInterface.createTable(
        'permissions',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          name: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
          },
          importHash: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          deletedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
        },
        { transaction: newTransaction }
      );

      await queryInterface.createTable(
        'file',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          belongsTo: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          belongsToId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
          },
          belongsToColumn: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
          },
          name: {
            type: Sequelize.DataTypes.STRING(2083),
            allowNull: false,
          },
          sizeInBytes: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
          },
          privateUrl: {
            type: Sequelize.DataTypes.STRING(2083),
            allowNull: true,
          },
          publicUrl: {
            type: Sequelize.DataTypes.STRING(2083),
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          deletedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
        },
        { transaction: newTransaction }
      );

      await queryInterface.createTable(
        'agents',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          createdAt: { type: Sequelize.DataTypes.DATE },
          updatedAt: { type: Sequelize.DataTypes.DATE },
          deletedAt: { type: Sequelize.DataTypes.DATE },
          importHash: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
          },
        },
        { transaction: newTransaction }
      );

      await queryInterface.createTable(
        'attachments',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          createdAt: { type: Sequelize.DataTypes.DATE },
          updatedAt: { type: Sequelize.DataTypes.DATE },
          deletedAt: { type: Sequelize.DataTypes.DATE },
          importHash: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
          },
        },
        { transaction: newTransaction }
      );

      await queryInterface.createTable(
        'customers',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          createdAt: { type: Sequelize.DataTypes.DATE },
          updatedAt: { type: Sequelize.DataTypes.DATE },
          deletedAt: { type: Sequelize.DataTypes.DATE },
          importHash: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
            unique: true,
          },
        },
        { transaction: newTransaction }
      );

      await queryInterface.createTable(
        'folders',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            references: {
              key: 'id',
              model: 'users',
            },
          },
          updatedById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            createdAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            updatedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            deletedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
            },
            importHash: {
              type: Sequelize.DataTypes.STRING(255),
              allowNull: true,
              unique: true,
            },
          },
          { transaction: newTransaction }
        );
  
        await queryInterface.createTable(
          'mailboxes',
          {
            id: {
              type: Sequelize.DataTypes.UUID,
              defaultValue: Sequelize.DataTypes.UUIDV4,
              primaryKey: true,
            },
            createdById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            updatedById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            createdAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            updatedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            deletedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
            },
            importHash: {
              type: Sequelize.DataTypes.STRING(255),
              allowNull: true,
              unique: true,
            },
          },
          { transaction: newTransaction }
        );
  
        await queryInterface.createTable(
          'messages',
          {
            id: {
              type: Sequelize.DataTypes.UUID,
              defaultValue: Sequelize.DataTypes.UUIDV4,
              primaryKey: true,
            },
            createdById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            updatedById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            createdAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            updatedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            deletedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
            },
            importHash: {
              type: Sequelize.DataTypes.STRING(255),
              allowNull: true,
              unique: true,
            },
          },
          { transaction: newTransaction }
        );
  
        await queryInterface.createTable(
          'ticket_counts',
          {
            id: {
              type: Sequelize.DataTypes.UUID,
              defaultValue: Sequelize.DataTypes.UUIDV4,
              primaryKey: true,
            },
            createdById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            updatedById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            createdAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            updatedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            deletedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
            },
            importHash: {
              type: Sequelize.DataTypes.STRING(255),
              allowNull: true,
              unique: true,
            },
          },
          { transaction: newTransaction }
        );
  
        await queryInterface.createTable(
          'ticket_labels',
          {
            id: {
              type: Sequelize.DataTypes.UUID,
              defaultValue: Sequelize.DataTypes.UUIDV4,
              primaryKey: true,
            },
            createdById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            updatedById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            createdAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            updatedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            deletedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
            },
            importHash: {
              type: Sequelize.DataTypes.STRING(255),
              allowNull: true,
              unique: true,
            },
          },
          { transaction: newTransaction }
        );
  
        await queryInterface.createTable(
          'tickets',
          {
            id: {
              type: Sequelize.DataTypes.UUID,
              defaultValue: Sequelize.DataTypes.UUIDV4,
              primaryKey: true,
            },
            createdById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            updatedById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            createdAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            updatedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            deletedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
            },
            importHash: {
              type: Sequelize.DataTypes.STRING(255),
              allowNull: true,
              unique: true,
            },
          },
          { transaction: newTransaction }
        );
  
        await queryInterface.createTable(
          'webhooks',
          {
            id: {
              type: Sequelize.DataTypes.UUID,
              defaultValue: Sequelize.DataTypes.UUIDV4,
              primaryKey: true,
            },
            createdById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            updatedById: {
              type: Sequelize.DataTypes.UUID,
              references: {
                key: 'id',
                model: 'users',
              },
            },
            createdAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            updatedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: false,
            },
            deletedAt: {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
            },
            importHash: {
              type: Sequelize.DataTypes.STRING(255),
              allowNull: true,
              unique: true,
            },
          },
          { transaction: newTransaction }
        );
  
        // Commit the new transaction
        await newTransaction.commit();
  
        // Adding columns conditionally
        const columnTransaction = await queryInterface.sequelize.transaction();
        try {
          const tableInfo = await queryInterface.describeTable('users');
  
          if (!tableInfo.firstName) {
            await queryInterface.addColumn('users', 'firstName', {
              type: Sequelize.DataTypes.TEXT,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.lastName) {
            await queryInterface.addColumn('users', 'lastName', {
              type: Sequelize.DataTypes.TEXT,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.phoneNumber) {
            await queryInterface.addColumn('users', 'phoneNumber', {
              type: Sequelize.DataTypes.TEXT,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.email) {
            await queryInterface.addColumn('users', 'email', {
              type: Sequelize.DataTypes.TEXT,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.disabled) {
            await queryInterface.addColumn('users', 'disabled', {
              type: Sequelize.DataTypes.BOOLEAN,
              defaultValue: false,
              allowNull: false,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.password) {
            await queryInterface.addColumn('users', 'password', {
              type: Sequelize.DataTypes.TEXT,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.emailVerified) {
            await queryInterface.addColumn('users', 'emailVerified', {
              type: Sequelize.DataTypes.BOOLEAN,
              defaultValue: false,
              allowNull: false,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.emailVerificationToken) {
            await queryInterface.addColumn('users', 'emailVerificationToken', {
              type: Sequelize.DataTypes.TEXT,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.emailVerificationTokenExpiresAt) {
            await queryInterface.addColumn('users', 'emailVerificationTokenExpiresAt', {
              type: Sequelize.DataTypes.DATE,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.passwordResetToken) {
            await queryInterface.addColumn('users', 'passwordResetToken', {
              type: Sequelize.DataTypes.TEXT,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.passwordResetTokenExpiresAt) {
            await queryInterface.addColumn('users', 'passwordResetTokenExpiresAt', {
              type: Sequelize.DataTypes.DATE,
            }, { transaction: columnTransaction });
          }
  
          if (!tableInfo.provider) {
            await queryInterface.addColumn('users', 'provider', {
              type: Sequelize.DataTypes.TEXT,
            }, { transaction: columnTransaction });
          }
  
          await columnTransaction.commit();
        } catch (err) {
          await columnTransaction.rollback();
          throw err;
        }
      // Adding columns to other tables
      await queryInterface.sequelize.transaction(async (transaction) => {
          await queryInterface.addColumn('agents', 'agent_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('attachments', 'attachment_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('customers', 'customer_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('folders', 'folder_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('mailboxes', 'mailbox_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('messages', 'message_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('ticket_counts', 'count_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('ticket_labels', 'label_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('tickets', 'ticket_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
          await queryInterface.addColumn('webhooks', 'webhook_id', { type: Sequelize.DataTypes.TEXT }, { transaction });
      });
      } catch (err) {
      await transaction.rollback();
      throw err;
      }
  },

/**
 * @param {QueryInterface} queryInterface
 * @param {Sequelize} Sequelize
 * @returns {Promise<void>}
 */
async down(queryInterface, Sequelize) {
  /**
   * @type {Transaction}
   */
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.removeColumn('webhooks', 'webhook_id', { transaction });
    await queryInterface.removeColumn('tickets', 'ticket_id', { transaction });
    await queryInterface.removeColumn('ticket_labels', 'label_id', { transaction });
    await queryInterface.removeColumn('ticket_counts', 'count_id', { transaction });
    await queryInterface.removeColumn('messages', 'message_id', { transaction });
    await queryInterface.removeColumn('mailboxes', 'mailbox_id', { transaction });
    await queryInterface.removeColumn('folders', 'folder_id', { transaction });
    await queryInterface.removeColumn('customers', 'customer_id', { transaction });
    await queryInterface.removeColumn('attachments', 'attachment_id', { transaction });
    await queryInterface.removeColumn('agents', 'agent_id', { transaction });
    await queryInterface.removeColumn('users', 'provider', { transaction });
    await queryInterface.removeColumn('users', 'passwordResetTokenExpiresAt', { transaction });
    await queryInterface.removeColumn('users', 'passwordResetToken', { transaction });
    await queryInterface.removeColumn('users', 'emailVerificationTokenExpiresAt', { transaction });
    await queryInterface.removeColumn('users', 'emailVerificationToken', { transaction });
    await queryInterface.removeColumn('users', 'emailVerified', { transaction });
    await queryInterface.removeColumn('users', 'password', { transaction });
    await queryInterface.removeColumn('users', 'disabled', { transaction });
    await queryInterface.removeColumn('users', 'email', { transaction });
    await queryInterface.removeColumn('users', 'phoneNumber', { transaction });
    await queryInterface.removeColumn('users', 'lastName', { transaction });
    await queryInterface.removeColumn('users', 'firstName', { transaction });

    await queryInterface.dropTable('webhooks', { transaction });
    await queryInterface.dropTable('tickets', { transaction });
    await queryInterface.dropTable('ticket_labels', { transaction });
    await queryInterface.dropTable('ticket_counts', { transaction });
    await queryInterface.dropTable('messages', { transaction });
    await queryInterface.dropTable('mailboxes', { transaction });
    await queryInterface.dropTable('folders', { transaction });
    await queryInterface.dropTable('customers', { transaction });
    await queryInterface.dropTable('attachments', { transaction });
    await queryInterface.dropTable('agents', { transaction });
    await queryInterface.dropTable('file', { transaction });
    await queryInterface.dropTable('permissions', { transaction });
    await queryInterface.dropTable('roles', { transaction });
    await queryInterface.dropTable('users', { transaction });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
},
};