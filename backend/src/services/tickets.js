const db = require('../db/models');
const FileDBApi = require('../db/api/file');
const Utils = require('../db/utils');
const TicketsDBApi = require('../db/api/tickets');
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TicketsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      // Find all users with the role of 'Agent'
      const agents = await db.users.findAll({
        where: { role: 'Agent' }
      });

      if (agents.length === 0) {
        throw new Error('No agents available for assignment');
      }

      // Find the agent with the least number of assigned tickets
      const agentAssignments = await Promise.all(agents.map(async (agent) => {
        const ticketCount = await db.tickets.count({ where: { assigneeId: agent.id } });
        return { agent, ticketCount };
      }));

      const { agent: selectedAgent } = agentAssignments.reduce((min, current) => 
        (current.ticketCount < min.ticketCount) ? current : min
      );

      // Create the ticket
      const ticket = await db.tickets.create(
        {
          subject: data.subject || null,
          priority: data.priority || null,
          description: data.description || null,
          status: data.status || 'pending',
          assigneeId: selectedAgent.id,
          customerId: data.customer || null,
          createdById: currentUser.id,
          updatedById: currentUser.id,
        },
        { transaction },
      );

      // Handle files
      if (data.files && data.files.length > 0) {
        await FileDBApi.replaceRelationFiles(
          {
            belongsTo: 'tickets',
            belongsToColumn: 'files',
            belongsToId: ticket.id,
          },
          data.files,
          { transaction, currentUser },
        );
      }

      // Update related customer
      if (data.customer) {
        const customer = await db.customers.findByPk(data.customer, {
          transaction,
        });
        if (customer) {
          customer.ticketCount = (customer.ticketCount || 0) + 1;
          customer.lastTicketCreatedAt = new Date();
          await customer.save({ transaction });
        }
      }

      await transaction.commit();
      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      await transaction.rollback();
      throw error;
    }
  }

  static async getStats() {
    try {
      return await TicketsDBApi.getStats();
    } catch (error) {
      console.error('Error in TicketsService.getStats:', error);
      throw error;
    }
  }

  static async update(id, data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const ticket = await db.tickets.findByPk(id, { transaction });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      await ticket.update(
        {
          subject: data.subject || ticket.subject,
          priority: data.priority || ticket.priority,
          description: data.description || ticket.description,
          status: data.status || ticket.status,
          assigneeId: data.assignee || ticket.assigneeId,
          customerId: data.customer || ticket.customerId,
          updatedById: currentUser.id,
        },
        { transaction },
      );

      await transaction.commit();
      return ticket;
    } catch (error) {
      console.error('Error updating ticket:', error);
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      const ticket = await db.tickets.findByPk(id, { transaction });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      await ticket.update(
        {
          deletedBy: currentUser.id,
        },
        { transaction },
      );

      await ticket.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      console.error('Error removing ticket:', error);
      await transaction.rollback();
      throw error;
    }
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const ticket = await db.tickets.findOne({ where }, { transaction });

    if (!ticket) {
      return ticket;
    }

    return ticket.get({ plain: true });
  }

  static async findAll(filter, options) {
    const limit = filter.limit || 0;
    const offset = (+filter.page || 0) * limit;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [];

    if (filter) {
      if (filter.id) {
        where.id = Utils.uuid(filter.id);
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where.createdAt = {
            ...where.createdAt,
            [Op.gte]: start,
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where.createdAt = {
            ...where.createdAt,
            [Op.lte]: end,
          };
        }
      }
    }

    let { rows, count } = await db.tickets.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: (filter.field && filter.sort)
        ? [[filter.field, filter.sort]]
        : [['createdAt', 'desc']],
      transaction,
    });

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where[Op.or] = [
        { id: Utils.uuid(query) },
        { subject: { [Op.iLike]: `%${query}%` } }
      ];
    }

    const records = await db.tickets.findAll({
      attributes: ['id', 'subject'],
      where,
      limit: limit ? Number(limit) : undefined,
      order: [['subject', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.subject,
    }));
  }
};