// src/services/auth.js
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
  static async signup(email, password, options = {}, host) {
    const user = await UsersDBApi.findBy({ email });

    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);



    if (user) {
      if (user.authenticationUid) {
        throw new ValidationError('auth.emailAlreadyInUse');
      }

      if (user.disabled) {
        throw new ValidationError('auth.userDisabled');
      }

      await UsersDBApi.updatePassword(user.id, password, options);

      if (process.env.NODE_ENV !== 'development' && EmailSender.isConfigured) {
        await this.sendEmailAddressVerificationEmail(user.email, host);
      }

      const data = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      return { token: helpers.jwtSign(data) };
    }

    const newUser = await UsersDBApi.createFromAuth(
      {
        firstName: options.firstName || email.split('@')[0],
        lastName: options.lastName || '',
        password: password,
        email: email,
      },
      options,
    );

    if (process.env.NODE_ENV !== 'development' && EmailSender.isConfigured) {
      await this.sendEmailAddressVerificationEmail(newUser.email, host);
    }

    const data = {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };

    return { token: helpers.jwtSign(data) };
  }

  static async signin(email, password, options = {}) {
    try {
      // Find the user by email
      const user = await UsersDBApi.findBy({ email });

      // Log retrieved user for debugging
      console.log('Retrieved user:', user);

      // Check if user exists
      if (!user) {
        throw new ValidationError('User not found. Please check your email and try again.');
      }

      // Check if user is disabled
      if (user.disabled) {
        throw new ValidationError('Your account has been disabled. Please contact support.');
      }

      // Check if the user has a password (in case of social login users without a password)
      if (!user.password) {
        throw new ValidationError('No password found for this user.');
      }

      // Compare the provided password with the stored hashed password
      // Remove double Hash
      const passwordsMatch = await bcrypt.compare(password, user.password);
      console.log('Provided password:', password);
      console.log('Stored password:', user.password);
      console.log('Passwords match:', passwordsMatch);
      
      if (!passwordsMatch) {
        throw new ValidationError('Invalid password. Please try again.');
      }

      // Create JWT payload with user details
      const data = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      // Sign and return the JWT token
      const token = helpers.jwtSign(data);
      console.log('Generated JWT token:', token);

      // Return the token along with the user details
      return { token, user: data.user };

    } catch (error) {
      // Log and rethrow the error with a validation message
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
