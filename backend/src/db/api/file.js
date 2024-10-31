const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class FileDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const file = await db.file.create(
      {
        id: data.id || undefined,
        belongsTo: data.belongsTo || null,
        belongsToId: data.belongsToId || null,
        belongsToColumn: data.belongsToColumn || null,
        name: data.name || null,
        sizeInBytes: data.sizeInBytes || null,
        privateUrl: data.privateUrl || null,
        publicUrl: data.publicUrl || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return file;
  }

  static async replaceRelationFiles(
    {
      belongsTo,
      belongsToColumn,
      belongsToId,
    },
    files,
    options,
  ) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    try {
      // Remove existing files
      await db.file.destroy({
        where: {
          belongsTo,
          belongsToColumn,
          belongsToId,
        },
        transaction,
      });

      // Add new files
      for (let file of files) {
        await db.file.create(
          {
            belongsTo,
            belongsToColumn,
            belongsToId,
            name: file.name,
            sizeInBytes: file.sizeInBytes,
            privateUrl: file.privateUrl,
            publicUrl: file.publicUrl,
            createdById: currentUser.id,
            updatedById: currentUser.id,
          },
          {
            transaction,
          },
        );
      }
    } catch (error) {
      console.error('Error in replaceRelationFiles:', error);
      throw error;
    }
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const file = await db.file.findByPk(id, {}, { transaction });

    await file.update(
      {
        belongsTo: data.belongsTo || null,
        belongsToId: data.belongsToId || null,
        belongsToColumn: data.belongsToColumn || null,
        name: data.name || null,
        sizeInBytes: data.sizeInBytes || null,
        privateUrl: data.privateUrl || null,
        publicUrl: data.publicUrl || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return file;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const file = await db.file.findByPk(id, options);

    await file.update({
      deletedBy: currentUser.id
    }, {
      transaction,
    });

    await file.destroy({
      transaction,
    });

    return file;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const file = await db.file.findOne(
      { where },
      { transaction },
    );

    if (!file) {
      return file;
    }

    const output = file.get({ plain: true });

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

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'file',
            'name',
            filter.name,
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

    let { rows, count } = await db.file.findAndCountAll({
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