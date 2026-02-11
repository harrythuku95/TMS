const db = require('../db/models');
const TicketNotesDBApi = require('../db/api/ticketNotes');

module.exports = class TicketNotesService {
  static async create(ticketId, data, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      // Verify ticket exists
      const ticket = await db.tickets.findByPk(ticketId, { transaction });
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      // Validate note content
      if (!data.note || data.note.trim() === '') {
        throw new Error('Note content cannot be empty');
      }

      const noteData = {
        ticketId,
        note: data.note,
        createdById: currentUser.id,
      };

      const note = await TicketNotesDBApi.create(noteData, { transaction });

      await transaction.commit();
      return note;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      const note = await TicketNotesDBApi.findBy({ id }, { transaction });

      if (!note) {
        throw new Error('Note not found');
      }

      // Authorization: Only creator or Admin can edit
      if (note.createdById !== currentUser.id && currentUser.role !== 'Admin') {
        throw new Error('Unauthorized: You can only edit your own notes');
      }

      // Validate note content
      if (!data.note || data.note.trim() === '') {
        throw new Error('Note content cannot be empty');
      }

      const updatedNote = await TicketNotesDBApi.update(id, { note: data.note }, { transaction });

      await transaction.commit();
      return updatedNote;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      const note = await TicketNotesDBApi.findBy({ id }, { transaction });

      if (!note) {
        throw new Error('Note not found');
      }

      // Authorization: Only creator or Admin can delete
      if (note.createdById !== currentUser.id && currentUser.role !== 'Admin') {
        throw new Error('Unauthorized: You can only delete your own notes');
      }

      await TicketNotesDBApi.remove(id, { transaction });

      await transaction.commit();
      return id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async findAllByTicket(ticketId) {
    try {
      // Verify ticket exists
      const ticket = await db.tickets.findByPk(ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      return await TicketNotesDBApi.findAllByTicket(ticketId);
    } catch (error) {
      throw error;
    }
  }
};
