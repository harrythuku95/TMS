module.exports = function (sequelize, DataTypes) {
  const customers = sequelize.define(
    'customers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      customer_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.TEXT,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  customers.associate = (db) => {
    db.customers.belongsTo(db.users, {
      as: 'createdBy',
      foreignKey: 'createdById',
    });

    db.customers.belongsTo(db.users, {
      as: 'updatedBy',
      foreignKey: 'updatedById',
    });

    db.customers.hasMany(db.tickets, {
      as: 'tickets',
      foreignKey: 'customerId',
    });
  };

  return customers;
};