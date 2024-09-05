const db = require('../db/models');
const CloseRequestDBApi = require('../db/api/closeRequest');

module.exports = class CloseRequestService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const closeRequest = await CloseRequestDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return closeRequest;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const closeRequest = await CloseRequestDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return closeRequest;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await CloseRequestDBApi.remove(id, {
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
    const record = await CloseRequestDBApi.findBy(where, options);
    return record;
  }

  static async findAll(filter, options) {
    return CloseRequestDBApi.findAll(filter, options);
  }

  static async approve(closeRequestId, userId) {
    const transaction = await db.sequelize.transaction();
    try {
      const closeRequest = await db.closeRequest.findByPk(closeRequestId, {
        include: [{ model: db.users, as: 'approvers' }],
        transaction,
      });

      if (!closeRequest) {
        throw new Error('Close request not found.');
      }

      if (closeRequest.approvers.some(approver => approver.id === userId)) {
        throw new Error('User has already approved this request.');
      }

      await closeRequest.addApprover(userId, { transaction });
      closeRequest.number_of_approval_requests += 1;

      if (closeRequest.number_of_approval_requests >= 2) {
        closeRequest.approved = true;
        const ticket = await db.tickets.findByPk(closeRequest.ticketId, { transaction });
        ticket.status = 'closed';
        await ticket.save({ transaction });
      }

      await closeRequest.save({ transaction });
      await transaction.commit();
      return closeRequest;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};