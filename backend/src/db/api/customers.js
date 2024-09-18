const db = require('../models');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CustomersDBApi {
  static async create(data, options) {
    const transaction = (options && options.transaction) || undefined;
    try {
      console.log('Received data:', data);
      
      // Check for existing soft-deleted customer with the same email
      const existingCustomer = await db.customers.findOne({
        where: { email: data.email },
        paranoid: false // This allows us to find soft-deleted records
      });
  
      if (existingCustomer) {
        if (existingCustomer.deletedAt) {
          // If the customer was soft-deleted, restore and update it
          await existingCustomer.restore({ transaction });
          Object.assign(existingCustomer, {
            name: data.name,
            phone: data.phone,
            address: data.address,
            updatedById: options.currentUser.id
          });
          await existingCustomer.save({ transaction });
          return existingCustomer;
        } else {
          // If the customer exists and is not deleted, throw an error
          throw new Error('A customer with this email already exists.');
        }
      }
  
      // If no existing customer, create a new one
      const customer = await db.customers.create(
        {
          customer_id: `CUST${Date.now()}${data.name.replace(/\s+/g, '')}`,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          createdById: options.currentUser.id,
          updatedById: options.currentUser.id,
        },
        { transaction }
      );
      return customer;
    } catch (error) {
      console.error('Error in CustomersDBApi.create:', error);
      throw error;
    }
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customer = await db.customers.findByPk(id, { transaction });

    if (!customer) {
      throw new Error('Customer not found');
    }

    await customer.update(
      {
        customer_id: data.customer_id || `CUST${Date.now()}${data.name}`,
        name: data.name || customer.name,
        email: data.email || customer.email,
        phone: data.phone || customer.phone,
        address: data.address || customer.address,
        updatedById: currentUser.id,
      },
      { transaction }
    );

    return customer;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customer = await db.customers.findByPk(id, options);

    if (!customer) {
      throw new Error('Customer not found');
    }

    await customer.update({
      deletedBy: currentUser.id
    }, {
      transaction,
    });

    await customer.destroy({
      transaction,
    });

    return customer;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const customer = await db.customers.findOne(
      { where },
      { transaction }
    );

    if (!customer) {
      return customer;
    }

    const output = customer.get({ plain: true });

    return output;
  }

  static async findAll(filter, options) {
    try {
      console.log('Filter:', filter);
      console.log('Options:', options);
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
          as: 'createdBy',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: db.users,
          as: 'updatedBy',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ];
  
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
              'customers',
              'name',
              filter.name,
            ),
          };
        }
  
        if (filter.email) {
          where = {
            ...where,
            [Op.and]: Utils.ilike(
              'customers',
              'email',
              filter.email,
            ),
          };
        }
  
        if (filter.phone) {
          where = {
            ...where,
            [Op.and]: Utils.ilike(
              'customers',
              'phone',
              filter.phone,
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
  
      let { rows, count } = await db.customers.findAndCountAll({
        where,
        include,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        order: orderBy,
        transaction,
      });
  
      return { rows, count };
    } catch (error) {
      console.error('Error in CustomersDBApi.findAll:', error);
      console.error('Error in CustomersDBApi.findAll:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike(
            'customers',
            'name',
            query,
          ),
        ],
      };
    }

    const records = await db.customers.findAll({
      attributes: [ 'id', 'name' ],
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