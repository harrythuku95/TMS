module.exports = function (sequelize, DataTypes) {
  const ticketNotes = sequelize.define(
    'ticketNotes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ticketId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    }
  );

  ticketNotes.associate = (db) => {
    db.ticketNotes.belongsTo(db.tickets, {
      as: 'ticket',
      foreignKey: 'ticketId',
    });

    db.ticketNotes.belongsTo(db.users, {
      as: 'createdBy',
      foreignKey: 'createdById',
    });
  };

  return ticketNotes;
};
