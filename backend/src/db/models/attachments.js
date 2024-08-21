const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const attachments = sequelize.define(
    'attachments',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      attachment_id: {
        type: DataTypes.TEXT,
      },

      file_type: {
        type: DataTypes.STRING(255),
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

  attachments.associate = (db) => {
    db.attachments.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.attachments.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return attachments;
};
