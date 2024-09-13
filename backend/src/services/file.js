const FileDBApi = require('../db/api/file');
const ValidationError = require('./notifications/errors/validation');

module.exports = class FileService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const ticket = await TicketsDBApi.create(data, {
        currentUser,
        transaction,
      });

      if (data.files && data.files.length) {
        await FileDBApi.replaceRelationFiles(
          {
            belongsTo: db.tickets.getTableName(),
            belongsToColumn: 'files',
            belongsToId: ticket.id,
          },
          data.files,
          {
            transaction,
            currentUser,
          },
        );
      }

      await transaction.commit();
      return ticket;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const record = await FileDBApi.update(
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
      await FileDBApi.remove(id, {
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
    const record = await FileDBApi.findBy(where, options);

    if (!record) {
      throw new ValidationError('file.errors.notFound');
    }

    return record;
  }

  static async findAll(filter, options) {
    return FileDBApi.findAll(filter, options);
  }
};