const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class UsersDBApi {
  static async create(data, options) {
    const transaction = (options && options.transaction) || undefined;
    const users = await db.users.create(data, { transaction });
    console.log(`transaction of the user in the UserDBApi.create() method: ${transaction}`);
    console.log(`Logging the data in the UserDBApi.create() method:${data}`)
    return users;
  }

  static async update(id, data, options) {
    const transaction = (options && options.transaction) || undefined;
    await db.users.update(data, { where: { id }, transaction });

    return db.users.findByPk(id);
  }

  static async remove(id, options) {
    const transaction = (options && options.transaction) || undefined;

    await db.users.destroy({ where: { id }, transaction });

    return id;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findOne({ where }, { transaction });

    if (!users) {
      return users;
    }

    return users;
  }

  static async findAll(filter, options) {
    let limit = filter.limit || 0;
    let offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const where = {};

    if (filter.id) {
      where['id'] = Utils.uuid(filter.id);
    }

    if (filter.firstName) {
      where['firstName'] = {
        [Op.like]: `%${filter.firstName}%`,
      };
    }

    if (filter.lastName) {
      where['lastName'] = {
        [Op.like]: `%${filter.lastName}%`,
      };
    }

    if (filter.email) {
      where['email'] = {
        [Op.like]: `%${filter.email}%`,
      };
    }

    if (filter.role) {
      where['role'] = filter.role;
    }

    const { rows, count } = await db.users.findAndCountAll({
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: [['createdAt', 'DESC']],
    });

    return { rows, count };
  }
};