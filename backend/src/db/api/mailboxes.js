const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MailboxesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const mailboxes = await db.mailboxes.create(
      {
        id: data.id || undefined,
        mailbox_id: data.mailbox_id || null,
        name: data.name || null,
        type: data.type || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return mailboxes;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const mailboxesData = data.map((item, index) => ({
      id: item.id || undefined,
      mailbox_id: item.mailbox_id || null,
      name: item.name || null,
      type: item.type || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    const mailboxes = await db.mailboxes.bulkCreate(mailboxesData, {
      transaction,
    });

    return mailboxes;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const mailboxes = await db.mailboxes.findByPk(id, {}, { transaction });

    await mailboxes.update(
      {
        mailbox_id: data.mailbox_id || null,
        name: data.name || null,
        type: data.type || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return mailboxes;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const mailboxes = await db.mailboxes.findByPk(id, options);

    await mailboxes.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await mailboxes.destroy({
      transaction,
    });

    return mailboxes;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const mailboxes = await db.mailboxes.findOne({ where }, { transaction });

    if (!mailboxes) {
      return mailboxes;
    }

    const output = mailboxes.get({ plain: true });

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

      if (filter.mailbox_id) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('mailboxes', 'mailbox_id', filter.mailbox_id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('mailboxes', 'name', filter.name),
        };
      }

      if (filter.type) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('mailboxes', 'type', filter.type),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
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
          count: await db.mailboxes.count({
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
      : await db.mailboxes.findAndCountAll({
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
          Utils.ilike('mailboxes', 'id', query),
        ],
      };
    }

    const records = await db.mailboxes.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
