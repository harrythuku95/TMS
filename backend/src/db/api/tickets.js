const db = require('../models');
const FileDBApi = require('./file');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TicketsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
  
    const tickets = await db.tickets.create(
      {
        id: data.id || undefined,
        ticket_id: data.ticket_id || null,
        subject: data.subject || null,
        priority: data.priority || null,
        description: data.description || null,
        status: data.status || 'pending',
        assigneeId: data.assigneeId || null,  // This will be set by the service layer
        customerId: data.customer || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );
  
    if (data.files && data.files.length > 0) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: 'tickets',
          belongsToColumn: 'files',
          belongsToId: tickets.id,
        },
        data.files,
        options,
      );
    }
  
    return tickets;
  }

  static async getStats() {
    try {
      const openCount = await db.tickets.count({ where: { status: 'open' } });
      const closedCount = await db.tickets.count({ where: { status: 'closed' } });
      const pendingCount = await db.tickets.count({ where: { status: 'pending' } });

      return {
        open: openCount,
        closed: closedCount,
        pending: pendingCount
      };
    } catch (error) {
      console.error('Error in TicketsDBApi.getStats:', error);
      throw error;
    }
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const ticketsData = data.map((item, index) => ({
      id: item.id || undefined,
      ticket_id: item.ticket_id || null,
      subject: item.subject || null,
      priority: item.priority || null,
      description: item.description || null,
      status: item.status || 'pending',
      assigneeId: item.assignee || null,
      customerId: item.customer || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    const tickets = await db.tickets.bulkCreate(ticketsData, { transaction });

    return tickets;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const tickets = await db.tickets.findByPk(id, {}, { transaction });

    await tickets.update(
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

    return tickets;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const tickets = await db.tickets.findByPk(id, options);

    await tickets.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await tickets.destroy({
      transaction,
    });

    return tickets;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const tickets = await db.tickets.findOne({ where }, { transaction });

    if (!tickets) {
      return tickets;
    }

    const output = tickets.get({ plain: true });

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
