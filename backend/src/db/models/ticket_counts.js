const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const ticket_counts = sequelize.define(
    'ticket_counts',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      count_id: {
        type: DataTypes.TEXT,
      },
      count_type: {
        type: DataTypes.STRING,
      },
      count_value: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

  ticket_counts.associate = (db) => {
    db.ticket_counts.belongsTo(db.tickets, {
      as: 'ticket',
      foreignKey: 'ticketId',
    });

    db.ticket_counts.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.ticket_counts.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return ticket_counts;
};
