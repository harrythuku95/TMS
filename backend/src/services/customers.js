const db = require('../db/models');
const CustomersDBApi = require('../db/api/customers');
const ValidationError = require('./notifications/errors/validation');

module.exports = class CustomersService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      console.log('Creating customer with data:', data);
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
      console.error('Error in CustomersService.create:', error);
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
    return CustomersDBApi.findAll(filter, options);
  }

  static async findAllAutocomplete(query, limit) {
    return CustomersDBApi.findAllAutocomplete(query, limit);
  }

  static async count() {
    try {
      return await CustomersDBApi.getCount();
    } catch (error) {
      console.error('Error in CustomersService.count:', error);
      throw error;
    }
  }

  static async bulkImport(data, importOptions) {
    return CustomersDBApi.bulkImport(data, importOptions);
  }
};