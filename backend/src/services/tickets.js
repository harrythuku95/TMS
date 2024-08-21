const db = require('../db/models');
const FileDBApi = require('../db/api/file');
const Utils = require('../db/utils');
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TicketsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      // Step 1: Create the ticket
      const ticket = await db.tickets.create(
        {
          id: data.id || undefined,
          ticket_id: data.ticket_id || null,
          subject: data.subject || null,
          priority: data.priority || null,
          description: data.description || null,
          status: data.status || 'pending',
          assigneeId: data.assignee || null,
          customerId: data.customer || null,
          importHash: data.importHash || null,
          createdById: currentUser.id,
          updatedById: currentUser.id,
        },
        { transaction },
      );

      // Step 2: Handle files (upload and association with the ticket)
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

      // Step 3: Handle labels if provided
      if (data.labels) {
        const labelsArray = data.labels.split(',').map(label_id => ({
          label_id,
          ticketId: ticket.id,
        }));
        await TicketLabelsService.bulkImport(labelsArray, currentUser);
      }

      // Step 4: Handle counts if provided
      if (data.counts) {
        const countsArray = data.counts.split(',').map(count => {
          if (count.count_value < 0) {
            throw new Error('Count values must be non-negative');
          }
          return {
            count_id: count.count_id,
            ticketId: ticket.id,
            count_value: count.count_value,
          };
        });
        await TicketCountsService.bulkImport(countsArray, currentUser);
      }

      // Step 5: Update related customer (if provided)
      if (data.customer) {
        const customer = await db.customers.findByPk(data.customer, {
          transaction,
        });
        if (customer) {
          // Increment ticket count or update last interaction date
          customer.ticketCount = (customer.ticketCount || 0) + 1;
          customer.lastTicketCreatedAt = new Date();

          await customer.save({ transaction });
        }
      }

      // Step 6: Commit the transaction
      await transaction.commit();
      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      await transaction.rollback();
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
          ticket_id: data.ticket_id || null,
          subject: data.subject || null,
          priority: data.priority || null,
          description: data.description || null,
          status: data.status || 'pending',
          assigneeId: data.assignee || null,
          customerId: data.customer || null,
          updatedById: currentUser.id,
        },
        { transaction },
      );

      // Validate counts if provided
      if (data.counts) {
        const countsArray = data.counts.split(',').map(count => {
          if (count.count_value < 0) {
            throw new Error('Count values must be non-negative');
          }
          return { count_id: count.count_id, ticketId: ticket.id, count_value: count.count_value };
        });
        await TicketCountsService.bulkImport(countsArray, currentUser);
      }

      await transaction.commit();
      return ticket;
    } catch (error) {
      console.error('Error updating ticket:', error); // Improved logging
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
      console.error('Error removing ticket:', error); // Improved logging
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

    const output = ticket.get({ plain: true });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.ticket_id) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('tickets', 'ticket_id', filter.ticket_id),
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.tickets.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.tickets.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('tickets', 'id', query),
        ],
      };
    }

    const records = await db.tickets.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }
};
