const rolesFields = {
  id: { type: 'id', label: 'ID' },

  name: { type: 'string', label: 'Name' },

  role_customization: { type: 'string', label: 'Role Customization' },

  permissions: { type: 'relation_many', label: 'Permissions' },
};

export default rolesFields;
