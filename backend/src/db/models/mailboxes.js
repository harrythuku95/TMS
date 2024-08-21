const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const mailboxes = sequelize.define(
    'mailboxes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      mailbox_id: {
        type: DataTypes.TEXT,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
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

  mailboxes.associate = (db) => {
    db.mailboxes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.mailboxes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return mailboxes;
};
