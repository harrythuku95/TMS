const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

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
        type: DataTypes.TEXT,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
    });

    db.customers.belongsTo(db.users, {
      as: 'updatedBy',
    });

    db.customers.hasMany(db.tickets, {
      as: 'tickets',
    });
  };

  return customers;
};
