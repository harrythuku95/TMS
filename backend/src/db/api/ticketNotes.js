const db = require('../models');

module.exports = class TicketNotesDBApi {
  static async create(data, options) {
    const transaction = (options && options.transaction) || undefined;
    const note = await db.ticketNotes.create(data, { transaction });
    return this.findBy({ id: note.id }, { transaction });
  }

  static async update(id, data, options) {
    const transaction = (options && options.transaction) || undefined;

    await db.ticketNotes.update(data, {
      where: { id },
      transaction,
    });

    return this.findBy({ id }, { transaction });
  }

  static async remove(id, options) {
    const transaction = (options && options.transaction) || undefined;

    const note = await db.ticketNotes.findByPk(id, { transaction });

    if (!note) {
      throw new Error('Note not found');
    }

    await note.destroy({ transaction });

    return id;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const note = await db.ticketNotes.findOne({
      where,
      include: [
        {
          model: db.users,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      transaction,
    });

    return note;
  }

  static async findAllByTicket(ticketId, options) {
    const transaction = (options && options.transaction) || undefined;

    const notes = await db.ticketNotes.findAll({
      where: { ticketId },
      include: [
        {
          model: db.users,
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      transaction,
    });

    return notes;
  }
};
