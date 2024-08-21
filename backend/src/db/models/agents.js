const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const agents = sequelize.define(
    'agents',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      agent_id: {
        type: DataTypes.TEXT,
      },
      name: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
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

  agents.associate = (db) => {
    db.agents.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.agents.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return agents;
};
