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
    const user = await AuthService.signup(email, password, firstName, lastName);
    const token = helpers.jwtSign({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('Signup error:', error);
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
    res.status(200).json(user);
  })
);

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
