const db = require('../models');
const FileDBApi = require('./file');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TicketsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    
    try {
      const tickets = await db.tickets.create(
        {
          subject: data.subject || null,
          priority: data.priority || null,
          description: data.description || null,
          status: data.status || 'pending',
          assigneeId: data.assigneeId || null,
          customerId: data.customerId || null,
          closedById: data.closedById || null,
          closedAt: data.closedAt || null,
          openedAt: data.openedAt || null,
          pendingAt: data.pendingAt || null,
          createdById: currentUser.id,
          updatedById: currentUser.id,
        },
        { transaction },
      );
    
      return tickets;
    } catch(error){
      console.log(`Error Creating tickets${error}`)
      throw error;
    }

  }

  static async getStats() {
    try {
      const [openCount, closedCount, pendingCount] = await Promise.all([
        db.tickets.count({ where: { status: 'open' } }),
        db.tickets.count({ where: { status: 'closed' } }),
        db.tickets.count({ where: { status: 'pending' } })
      ]);

      return {
        open: openCount,
        closed: closedCount,
        pending: pendingCount
      };
    } catch (error) {
      console.error('Error getting ticket stats:', error);
      throw error;
    }
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const ticket = await db.tickets.findByPk(id, {
      transaction,
    });

    await ticket.update(
      {
        ...data,
        updatedById: currentUser.id,
      },
      { transaction }
    );

    return ticket;
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

    const ticket = await db.tickets.findOne(
      {
        where,
        include: [
          {
            model: db.users,
            as: 'assignee',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: db.users,
            as: 'closedBy',
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: db.customers,
            as: 'customer',
            attributes: ['id', 'name', 'email']
          }
        ]
      },
      { transaction }
    );

    if (!ticket) {
      return ticket;
    }

    return ticket.get({ plain: true });
  }


  static async findAll(filter, options) {
    let limit = filter.limit || 0;
    let offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    let orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'assignee',
        attributes: ['id', 'firstName', 'lastName', 'email']
      },
      {
        model: db.users,
        as: 'closedBy',
        attributes: ['id', 'firstName', 'lastName', 'email']
      },
      {
        model: db.customers,
        as: 'customer',
        attributes: ['id', 'name']
      }
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.subject) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('tickets', 'subject', filter.subject),
        };
      }


      if (filter.status) {
        where.status = filter.status;
      }

      if (filter.createdBy) {
        where = {
          ...where,
          ['createdById']: Utils.uuid(filter.createdBy),
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
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('tickets', 'subject', query),
        ],
      };
    }

    const records = await db.tickets.findAll({
      attributes: ['id', 'subject'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['subject', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.subject,
    }));
  }
};