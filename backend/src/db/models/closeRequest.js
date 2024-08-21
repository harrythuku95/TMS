// src/db/models/closeRequest.js
const config = require('../../config');

module.exports = function (sequelize, DataTypes) {
  const closeRequest = sequelize.define(
    'closeRequest',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      number_of_approval_requests: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  closeRequest.associate = (db) => {
    closeRequest.belongsTo(db.tickets, {
      as: 'ticket',
    });

    closeRequest.belongsTo(db.users, {
      as: 'createdBy',
    });

    closeRequest.belongsToMany(db.users, {
      as: 'approvers',
      through: 'CloseRequestApprovers',
      foreignKey: 'closeRequestId',
      otherKey: 'userId',
    });
  };

  return closeRequest;
};
