// src/db/models/tickets.js
const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const tickets = sequelize.define(
    'tickets',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      priority: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'pending',
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

  tickets.associate = (db) => {
    db.tickets.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.tickets.belongsTo(db.users, {
      as: 'updatedBy',
    });

    db.tickets.belongsTo(db.users, {
      as: 'assignee',
    });

    db.tickets.belongsTo(db.customers, {
      as: 'customer',
      foreignKey: 'customerId'
    });

    db.tickets.hasMany(db.file, {
      as: 'files',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: 'tickets',
      },
    });

    db.tickets.hasOne(db.closeRequest, {
      as: 'closeRequest',
      foreignKey: 'ticketId',
    });
  };

  return tickets;
};
