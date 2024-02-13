const { v4: uuid } = require('uuid');

module.exports = {
  /**
   * @param{import("sequelize").QueryInterface} queryInterface
   * @return {Promise<void>}
   */
  async up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = new Date();

    /** @type {Map<string, string>} */
    const idMap = new Map();

    /**
     * @param {string} key
     * @return {string}
     */
    function getId(key) {
      if (idMap.has(key)) {
        return idMap.get(key);
      }
      const id = uuid();
      idMap.set(key, id);
      return id;
    }

    await queryInterface.bulkInsert('roles', [
      {
        id: getId('Administrator'),
        name: 'Administrator',
        createdAt,
        updatedAt,
      },
      { id: getId('User'), name: 'User', createdAt, updatedAt },
    ]);

    /**
     * @param {string} name
     */
    function createPermissions(name) {
      return [
        {
          id: getId(`CREATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `CREATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`READ_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `READ_${name.toUpperCase()}`,
        },
        {
          id: getId(`UPDATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `UPDATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`DELETE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `DELETE_${name.toUpperCase()}`,
        },
      ];
    }

    const entities = [
      'users',
      'roles',
      'permissions',
      'users',
      'agents',
      'attachments',
      'customers',
      'folders',
      'mailboxes',
      'messages',
      'ticket_counts',
      'ticket_labels',
      'tickets',
      'webhooks',
      ,
    ];
    await queryInterface.bulkInsert(
      'permissions',
      entities.flatMap(createPermissions),
    );
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`READ_API_DOCS`),
        createdAt,
        updatedAt,
        name: `READ_API_DOCS`,
      },
    ]);
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`CREATE_SEARCH`),
        createdAt,
        updatedAt,
        name: `CREATE_SEARCH`,
      },
    ]);

    await queryInterface.sequelize
      .query(`create table "rolesPermissionsPermissions"
(
"createdAt"           timestamp with time zone not null,
"updatedAt"           timestamp with time zone not null,
"roles_permissionsId" uuid                     not null,
"permissionId"        uuid                     not null,
primary key ("roles_permissionsId", "permissionId")
);`);

    await queryInterface.bulkInsert('rolesPermissionsPermissions', [
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_AGENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_AGENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_AGENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_AGENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_ATTACHMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_ATTACHMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_ATTACHMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_ATTACHMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_CUSTOMERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_CUSTOMERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_CUSTOMERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_CUSTOMERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_FOLDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_FOLDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_FOLDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_FOLDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_MAILBOXES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_MAILBOXES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_MAILBOXES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_MAILBOXES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_MESSAGES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_MESSAGES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_MESSAGES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_MESSAGES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_TICKET_COUNTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_TICKET_COUNTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_TICKET_COUNTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_TICKET_COUNTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_TICKET_LABELS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_TICKET_LABELS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_TICKET_LABELS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_TICKET_LABELS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_TICKETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_TICKETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_TICKETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_TICKETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_WEBHOOKS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_WEBHOOKS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_WEBHOOKS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_WEBHOOKS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_ROLES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PERMISSIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_AGENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_AGENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_AGENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_AGENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_ATTACHMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_ATTACHMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_ATTACHMENTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_ATTACHMENTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_CUSTOMERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_CUSTOMERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_CUSTOMERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_CUSTOMERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_FOLDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_FOLDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_FOLDERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_FOLDERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_MAILBOXES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_MAILBOXES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_MAILBOXES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_MAILBOXES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_MESSAGES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_MESSAGES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_MESSAGES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_MESSAGES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_TICKET_COUNTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_TICKET_COUNTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_TICKET_COUNTS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_TICKET_COUNTS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_TICKET_LABELS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_TICKET_LABELS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_TICKET_LABELS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_TICKET_LABELS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_TICKETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_TICKETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_TICKETS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_TICKETS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_WEBHOOKS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_WEBHOOKS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_WEBHOOKS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_WEBHOOKS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SEARCH'),
      },
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'Administrator',
      )}' WHERE "email"='admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'User',
      )}' WHERE "email"='client@hello.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'User',
      )}' WHERE "email"='john@doe.com'`,
    );
  },
};
