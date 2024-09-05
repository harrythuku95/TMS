const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CustomersDBApi {
  static async create(data, options) {
    const currentUser = options && options.currentUser;
    const transaction = options && options.transaction;

    console.log(`Data from API: ${data}`)

    const customer = await db.customers.create(
      {
        id: data.id || undefined,
        customer_id: data.name || null,
        name: data.name,
        importHash: data.importHash || null,
        createdById: currentUser ? currentUser.id : null,
        updatedById: currentUser ? currentUser.id : null,
      },
      { transaction }
    );

    return customer;
  }

  static async findAll(filter, options) {
    console.log('CustomersDBApi findAll called with filter:', filter);
    try {
      let limit = filter.limit || 0;
      let offset = 0;
      const currentPage = +filter.page;
  
      offset = currentPage * limit;
  
      let whereClause = {};
      let include = [];
  
      if (filter) {
        if (filter.id) {
          whereClause = {
            ...whereClause,
            ['id']: Utils.uuid(filter.id),
          };
        }
  
        if (filter.name) {
          whereClause = {
            ...whereClause,
            [Op.and]: Utils.ilike('customers', 'name', filter.name),
          };
        }
  
        if (filter.customer_id) {
          whereClause = {
            ...whereClause,
            [Op.and]: Utils.ilike('customers', 'customer_id', filter.customer_id),
          };
        }
      }
  
      let { rows, count } = await db.customers.findAndCountAll({
        where: whereClause,
        include,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        order: [['createdAt', 'DESC']],
      });
  
      console.log(`Found ${count} customers`);
      return { rows, count };
    } catch (error) {
      console.error('Error in CustomersDBApi.findAll:', error);
      throw error;
    }
  }

  static async count(filter, options) {
    const whereClause = {};

    if (filter) {
      if (filter.id) {
        whereClause.id = Utils.uuid(filter.id);
      }

      if (filter.name) {
        whereClause.name = { [Op.like]: `%${filter.name}%` };
      }

      if (filter.customer_id) {
        whereClause.customer_id = { [Op.like]: `%${filter.customer_id}%` };
      }
    }

    return db.customers.count({
      where: whereClause,
      transaction: (options && options.transaction) || undefined,
    });
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customers = await db.customers.findByPk(id, {}, { transaction });

    await customers.update(
      {
        customer_id: data.customer_id || null,
        name: data.name,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return customers;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customers = await db.customers.findByPk(id, options);

    await customers.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await customers.destroy({
      transaction,
    });

    return customers;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const customers = await db.customers.findOne({ where }, { transaction });

    if (!customers) {
      return customers;
    }

    const output = customers.get({ plain: true });

    return output;
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('customers', 'name', query),
        ],
      };
    }

    const records = await db.customers.findAll({
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