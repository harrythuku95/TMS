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
      // Generate ticket name from sequence
      const [result] = await db.sequelize.query(
        "SELECT nextval('tickets_name_seq') as seq",
        { transaction }
      );
      const sequenceValue = result[0].seq;
      const ticketName = 'T' + sequenceValue.toString().padStart(4, '0');

      // Prepare ticket data
      const status = data.status || 'pending';
      const ticketData = {
        name: ticketName,
        subject: data.subject || null,
        priority: data.priority || null,
        description: data.description || null,
        status: status,
        assigneeId: null,
        customerId: data.customer || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      };

      // Set initial status timestamp
      if (status === 'pending') {
        ticketData.pendingAt = new Date();
      } else if (status === 'open') {
        ticketData.openedAt = new Date();
      } else if (status === 'closed') {
        ticketData.closedById = currentUser.id;
        ticketData.closedAt = new Date();
      }

      // Use TicketsDBApi to create the ticket
      const ticket = await TicketsDBApi.create(ticketData, {
        currentUser,
        transaction,
      });

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
      // Fetch the current ticket to compare status changes
      const currentTicket = await TicketsDBApi.findBy({ id }, { transaction });

      if (!currentTicket) {
        throw new Error('Ticket not found');
      }

      // Track status changes with timestamps
      if (data.status && data.status !== currentTicket.status) {
        if (data.status === 'closed') {
          data.closedById = currentUser.id;
          data.closedAt = new Date();
          // Save resolution if provided when closing
          if (data.resolution !== undefined) {
            data.resolution = data.resolution;
          }
        } else if (data.status === 'open') {
          data.openedAt = new Date();
        } else if (data.status === 'pending') {
          data.pendingAt = new Date();
        }
      }

      // Allow standalone resolution updates (even for already closed tickets)
      if (data.resolution !== undefined && (!data.status || data.status === currentTicket.status)) {
        data.resolution = data.resolution;
      }

      await TicketsDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        }
      );

      const updatedTicket = await TicketsDBApi.findBy({ id }, { transaction });

      await transaction.commit();
      return updatedTicket;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async findBy(where, options) {
    return TicketsDBApi.findBy(where, options);
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

      if (filter.createdBy) {
        where.createdById = Utils.uuid(filter.createdBy);
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
      include: [
        {
          model: db.customers,
          as: 'customer',
          attributes: ['id', 'name'],
        },
      ],
      distinct: true,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: (filter.field && filter.sort)
        ? [[filter.field, filter.sort]]
        : [['createdAt', 'desc']],
      transaction,
    });
    console.log('Tickets being sent:', JSON.stringify(rows, null, 2));
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