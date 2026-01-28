// src/routes/auth.js
const express = require('express');
const passport = require('passport');
const AuthService = require('../services/auth');
const wrapAsync = require('../helpers').wrapAsync;
const UsersDBApi = require('../db/api/users');
const helpers = require('../helpers');

const router = express.Router();

router.post(
  '/signin/local',
  wrapAsync(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      console.log(`Email:${email}`);
      console.log(`Password${password}`)
      const payload = await AuthService.signin(email, password, req);
      res.status(200).send(payload);
    } catch (error) {
      console.error('Signin error:', error);
      res.status(400).json({ error: error.message || 'Invalid email or password.' });
    }
  }),
);




router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const user = await AuthService.signup(email, password, firstName, lastName);
    const token = helpers.jwtSign({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle Sequelize unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'An account with this email already exists. Please use a different email or try signing in.' });
    }

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors?.[0]?.message || 'Invalid input data.' });
    }

    // Return the error message from ValidationError or generic message
    res.status(400).json({ error: error.message || 'Signup failed. Please try again.' });
  }
});

router.post(
  '/send-email-verification',
  wrapAsync(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    try {
      await AuthService.sendEmailAddressVerificationEmail(email, req.protocol + '://' + req.get('host'));
      res.status(200).json({ message: 'Verification email sent.' });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Failed to send verification email.' });
    }
  }),
);


router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  wrapAsync(async (req, res) => {
    const user = await UsersDBApi.findBy({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Explicitly serialize user data, excluding sensitive fields
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      disabled: user.disabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Prevent caching of user data to avoid stale data across sessions
    res.set('Cache-Control', 'no-cache, private');
    res.status(200).json(userData);
  })
);

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
