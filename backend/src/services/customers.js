const db = require('../db/models');
const CustomersDBApi = require('../db/api/customers');
const ValidationError = require('./notifications/errors/validation');
const { v4: uuidv4 } = require('uuid'); 

module.exports = class CustomersService {
  static async create(data, currentUser) {
    console.log('Data received in service:', data);
    console.log('Current user:', currentUser);
    
    if (!data) {
      throw new ValidationError('No data provided for customer creation.');
    }
  
    const transaction = await db.sequelize.transaction();
    try {
      if (!data.name) {
        throw new ValidationError('Customer name is required.');
      }
  
      const record = await CustomersDBApi.create(
        data,
        {
          currentUser,
          transaction,
        },
      );
  
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const record = await CustomersDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await CustomersDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async findBy(where, options) {
    const record = await CustomersDBApi.findBy(where, options);

    if (!record) {
      throw new ValidationError('Customer not found');
    }

    return record;
  }

  static async findAll(filter, options) {
    console.log('CustomersService findAll called');
    return CustomersDBApi.findAll(filter, options);
  }

  static async findAllAutocomplete(query, limit) {
    return CustomersDBApi.findAllAutocomplete(query, limit);
  }

  static async count(filter) {
    return CustomersDBApi.count(filter);
  }

  static async bulkImport(data, importOptions) {
    return CustomersDBApi.bulkImport(data, importOptions);
  }
};