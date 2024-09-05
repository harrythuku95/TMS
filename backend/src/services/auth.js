// src/services/auth.js
const db = require('../db/models');
const UsersDBApi = require('../db/api/users');
const ValidationError = require('./notifications/errors/validation');
const ForbiddenError = require('./notifications/errors/forbidden');
const bcrypt = require('bcrypt');
const EmailAddressVerificationEmail = require('./email/list/addressVerification');
const InvitationEmail = require('./email/list/invitation');
const PasswordResetEmail = require('./email/list/passwordReset');
const EmailSender = require('./email');
const config = require('../config');
const helpers = require('../helpers');

class Auth {

  static async signup(email, password, firstName, lastName) {
    const transaction = await db.sequelize.transaction();
    try {
      const userCount = await db.users.count();
      const role = userCount === 0 ? 'Admin' : 'User';

      const user = await db.users.create({
        email,
        password: await bcrypt.hash(password, 10),
        firstName,
        lastName,
        role,
        emailVerified: true 
      }, { transaction });

      await transaction.commit();
      console.log(`Transaction:${transaction}`);
      console.log(`User:${user}`);
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async signin(email, password, options = {}) {
    try {
      const user = await UsersDBApi.findBy({ email });
      if (!user) {
        throw new ValidationError('User not found. Please check your email and try again.');
      }
      if (user.disabled) {
        throw new ValidationError('Your account has been disabled. Please contact support.');
      }
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        throw new ValidationError('Invalid password. Please try again.');
      }
      const data = {
        id: user.id,
        email: user.email,
        role: user.role  // Include the role in the token payload
      };
      const token = helpers.jwtSign(data);
      return { token, user: data };
    } catch (error) {
      console.error('Signin error:', error);
      throw new ValidationError('Sign-in failed. Please try again.');
    }
  }

  
  static async sendEmailAddressVerificationEmail(email, host) {
    let link;
    try {
      const token = await UsersDBApi.generateEmailVerificationToken(email);
      link = `${host}/verify-email?token=${token}`;
    } catch (error) {
      console.error(error);
      throw new ValidationError('auth.emailAddressVerificationEmail.error');
    }

    const emailAddressVerificationEmail = new EmailAddressVerificationEmail(
      email,
      link,
    );

    return new EmailSender(emailAddressVerificationEmail).send();
  }

  static async sendPasswordResetEmail(email, type = 'register', host) {
    let link;

    try {
      const token = await UsersDBApi.generatePasswordResetToken(email);
      link = `${host}/password-reset?token=${token}`;
    } catch (error) {
      console.error(error);
      throw new ValidationError('auth.passwordReset.error');
    }

    let passwordResetEmail;
    if (type === 'register') {
      passwordResetEmail = new PasswordResetEmail(email, link);
    }
    if (type === 'invitation') {
      passwordResetEmail = new InvitationEmail(email, link);
    }

    return new EmailSender(passwordResetEmail).send();
  }

  static async verifyEmail(token, options = {}) {
    const user = await UsersDBApi.findByEmailVerificationToken(token, options);

    if (!user) {
      throw new ValidationError('auth.emailAddressVerificationEmail.invalidToken');
    }

    return UsersDBApi.markEmailVerified(user.id, options);
  }

  static async passwordUpdate(currentPassword, newPassword, options) {
    const currentUser = options.currentUser || null;
    if (!currentUser) {
      throw new ForbiddenError();
    }

    const currentPasswordMatch = await bcrypt.compare(
      currentPassword,
      currentUser.password,
    );

    if (!currentPasswordMatch) {
      throw new ValidationError('auth.wrongPassword');
    }

    const newPasswordMatch = await bcrypt.compare(
      newPassword,
      currentUser.password,
    );

    if (newPasswordMatch) {
      throw new ValidationError('auth.passwordUpdate.samePassword');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      config.bcrypt.saltRounds,
    );

    return UsersDBApi.updatePassword(currentUser.id, hashedPassword, options);
  }

  static async passwordReset(token, password, options = {}) {
    const user = await UsersDBApi.findByPasswordResetToken(token, options);

    if (!user) {
      throw new ValidationError('auth.passwordReset.invalidToken');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt.saltRounds,
    );

    return UsersDBApi.updatePassword(user.id, hashedPassword, options);
  }

  static async updateProfile(data, currentUser) {
    let transaction = await db.sequelize.transaction();

    try {
      await UsersDBApi.findBy({ id: currentUser.id }, { transaction });

      await UsersDBApi.update(currentUser.id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = Auth;
