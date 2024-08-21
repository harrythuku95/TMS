// src/services/closeRequest.js
const db = require('../db/models');
const ValidationError = require('./notifications/errors/validation');

module.exports = class CloseRequestService {
  static async createCloseRequest(ticketId, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const existingCloseRequest = await db.closeRequest.findOne({
        where: { ticketId },
      });

      if (existingCloseRequest) {
        throw new ValidationError('There is already a close request for this ticket.');
      }

      const closeRequest = await db.closeRequest.create({
        ticketId,
        createdById: currentUser.id,
        number_of_approval_requests: 0,
      }, { transaction });

      await transaction.commit();
      return closeRequest;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async approveCloseRequest(closeRequestId, userId) {
    const transaction = await db.sequelize.transaction();
    try {
      const closeRequest = await db.closeRequest.findByPk(closeRequestId, {
        include: [{ model: db.users, as: 'approvers' }],
      });

      if (!closeRequest) {
        throw new ValidationError('Close request not found.');
      }

      if (closeRequest.approvers.some(approver => approver.id === userId)) {
        throw new ValidationError('User has already approved this request.');
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
