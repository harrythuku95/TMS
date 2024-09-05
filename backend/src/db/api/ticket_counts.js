const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TicketCountsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const ticket_counts = await db.ticket_counts.create(
      {
        id: data.id || undefined,
        count_id: data.count_id || null,
        count_type: data.count_type || null,
        count_value: data.count_value || 0,
        ticketId: data.ticketId || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return ticket_counts;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const ticket_counts = await db.ticket_counts.findByPk(id, {}, { transaction });

    await ticket_counts.update(
      {
        count_id: data.count_id || null,
        count_type: data.count_type || null,
        count_value: data.count_value || 0,
        ticketId: data.ticketId || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return ticket_counts;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const ticket_counts = await db.ticket_counts.findByPk(id, options);

    await ticket_counts.update({
      deletedBy: currentUser.id
    }, {
      transaction,
    });

    await ticket_counts.destroy({
      transaction,
    });

    return ticket_counts;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const ticket_counts = await db.ticket_counts.findOne(
      { where },
      { transaction },
    );

    if (!ticket_counts) {
      return ticket_counts;
    }

    const output = ticket_counts.get({ plain: true });

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
    let include = [
      {
        model: db.tickets,
        as: 'ticket',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.count_id) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'ticket_counts',
            'count_id',
            filter.count_id,
          ),
        };
      }

      if (filter.count_type) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'ticket_counts',
            'count_type',
            filter.count_type,
          ),
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

    let { rows, count } = await db.ticket_counts.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy,
      transaction,
    });

    return { rows, count };
  }
};