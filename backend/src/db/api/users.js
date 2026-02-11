const db = require('../models');
const Utils = require('../utils');
const crypto = require('crypto');

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

  static async generatePasswordResetToken(email, options) {
    const transaction = (options && options.transaction) || undefined;

    const user = await db.users.findOne({ where: { email }, transaction });

    if (!user) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.users.update(
      {
        passwordResetToken: token,
        passwordResetTokenExpiresAt: tokenExpiresAt,
      },
      { where: { id: user.id }, transaction }
    );

    return token;
  }

  static async findByPasswordResetToken(token, options) {
    const transaction = (options && options.transaction) || undefined;

    const user = await db.users.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiresAt: {
          [Op.gt]: new Date(),
        },
      },
      transaction,
    });

    return user;
  }

  static async updatePassword(userId, hashedPassword, options) {
    const transaction = (options && options.transaction) || undefined;

    await db.users.update(
      {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      },
      { where: { id: userId }, transaction }
    );

    return db.users.findByPk(userId, { transaction });
  }
};