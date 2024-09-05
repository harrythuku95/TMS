const TicketCountsDBApi = require('../db/api/ticket_counts');
const TicketsDBApi = require('../db/api/tickets');


module.exports = class TicketCountsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const ticket_counts = await TicketCountsDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return ticket_counts;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const ticket_counts = await TicketCountsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return ticket_counts;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await TicketCountsDBApi.remove(id, {
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
    const record = await TicketCountsDBApi.findBy(where, options);
    return record;
  }

  static async findAll(filter, options) {
    return TicketCountsDBApi.findAll(filter, options);
  }

  static async updateTicketCounts(ticketId, counts, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      for (const count of counts) {
        const existingCount = await TicketCountsDBApi.findBy({ 
          ticketId, 
          count_type: count.count_type 
        }, { transaction });

        if (existingCount) {
          await TicketCountsDBApi.update(existingCount.id, { 
            count_value: count.count_value 
          }, { currentUser, transaction });
        } else {
          await TicketCountsDBApi.create({
            ticketId,
            count_type: count.count_type,
            count_value: count.count_value
          }, { currentUser, transaction });
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};