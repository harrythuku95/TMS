const TicketLabelsDBApi = require('../db/api/ticket_labels');
const TicketsDBApi = require('../db/api/tickets');

module.exports = class TicketLabelsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const ticket_labels = await TicketLabelsDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return ticket_labels;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const ticket_labels = await TicketLabelsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return ticket_labels;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await TicketLabelsDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async findBy(where, options) {
    const record = await TicketLabelsDBApi.findBy(where, options);
    return record;
  }

  static async findAll(filter, options) {
    return TicketLabelsDBApi.findAll(filter, options);
  }

  static async updateTicketLabels(ticketId, labels, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      // Remove existing labels
      await TicketLabelsDBApi.remove({ ticketId }, {
        currentUser,
        transaction,
      });

      // Add new labels
      for (const label of labels) {
        await TicketLabelsDBApi.create({
          ticketId,
          label_id: label,
        }, { currentUser, transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};