const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TicketLabelsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const ticket_labels = await db.ticket_labels.create(
      {
        id: data.id || undefined,
        label_id: data.label_id || null,
        ticketId: data.ticketId || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return ticket_labels;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const ticket_labels = await db.ticket_labels.findByPk(id, {}, { transaction });

    await ticket_labels.update(
      {
        label_id: data.label_id || null,
        ticketId: data.ticketId || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return ticket_labels;
  }

  static async remove(where, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
  
    const ticket_labels = await db.ticket_labels.findOne({ where }, { transaction });
  
    if (!ticket_labels) {
      throw new Error('TicketLabel not found');
    }
  
    await ticket_labels.update(
      {
        deletedBy: currentUser.id
      },
      {
        transaction,
      }
    );
  
    await ticket_labels.destroy({
      transaction,
    });
  
    return ticket_labels;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const ticket_labels = await db.ticket_labels.findOne(
      { where },
      { transaction },
    );

    if (!ticket_labels) {
      return ticket_labels;
    }

    const output = ticket_labels.get({ plain: true });

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

      if (filter.label_id) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'ticket_labels',
            'label_id',
            filter.label_id,
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

    let { rows, count } = await db.ticket_labels.findAndCountAll({
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