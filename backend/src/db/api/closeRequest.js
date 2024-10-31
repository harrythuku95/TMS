const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CloseRequestDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const closeRequest = await db.closeRequest.create(
      {
        ticketId: data.ticketId,
        createdById: currentUser.id,
      },
      { transaction },
    );

    return closeRequest;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const closeRequest = await db.closeRequest.findByPk(id, {}, { transaction });

    await closeRequest.update(
      {
        approved: data.approved,
        number_of_approval_requests: data.number_of_approval_requests,
      },
      { transaction },
    );

    return closeRequest;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const closeRequest = await db.closeRequest.findByPk(id, options);

    await closeRequest.destroy({ transaction });

    return closeRequest;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const closeRequest = await db.closeRequest.findOne(
      { where, include: ['ticket', 'approvers'] },
      { transaction },
    );

    if (!closeRequest) {
      return closeRequest;
    }

    const output = closeRequest.get({ plain: true });

    return output;
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
        model: db.tickets,
        as: 'ticket',
      },
      {
        model: db.users,
        as: 'approvers',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
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

    let { rows, count } = await db.closeRequest.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy,
      transaction,
    });

    return { rows, count };
  }
};