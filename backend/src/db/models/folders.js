const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const folders = sequelize.define(
    'folders',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      folder_id: {
        type: DataTypes.TEXT,
      },
      
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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

  folders.associate = (db) => {
    db.folders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.folders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return folders;
};
