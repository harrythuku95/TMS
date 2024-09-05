const config = require('../../config');

module.exports = function (sequelize, DataTypes) {
  const ticket_labels = sequelize.define(
    'ticket_labels',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      label_id: {
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

  ticket_labels.associate = (db) => {
    db.ticket_labels.belongsTo(db.tickets, {
      as: 'ticket',
      foreignKey: 'ticketId',
    });

    db.ticket_labels.belongsTo(db.users, {
      as: 'createdBy',
      foreignKey: 'createdById',
    });

    db.ticket_labels.belongsTo(db.users, {
      as: 'updatedBy',
      foreignKey: 'updatedById',
    });
  };

  return ticket_labels;
};