// src/routes/auth.js
const express = require('express');
const passport = require('passport');
const AuthService = require('../services/auth');
const ForbiddenError = require('../services/notifications/errors/forbidden');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           default: admin@flatlogic.com
 *           description: User email
 *         password:
 *           type: string
 *           default: password
 *           description: User password
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authorization operations
 */

/**
 * @swagger
 * /api/auth/signin/local:
 *   post:
 *     tags: [Auth]
 *     summary: Logs user into the system
 *     description: Logs user into the system
 *     requestBody:
 *       description: Set valid user email and password
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Auth"
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid username/password supplied
 *     x-codegen-request-body-name: body
 */
router.post(
  '/signin/local',
  wrapAsync(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      const payload = await AuthService.signin(email, password, req);
      res.status(200).send(payload);
    } catch (error) {
      console.error('Signin error:', error);
      res.status(400).json({ error: error.message || 'Invalid email or password.' });
    }
  }),
);


/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user into the system
 *     description: Register new user into the system
 *     requestBody:
 *       description: Set valid user email and password
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Auth"
 *     responses:
 *       200:
 *         description: New user successfully signed up
 *       400:
 *         description: Invalid username/password supplied
 *       500:
 *         description: Some server error
 *     x-codegen-request-body-name: body
 */
router.post(
  '/signup',
  wrapAsync(async (req, res) => {
    try {
      const payload = await AuthService.signup(
        req.body.email,
        req.body.password,
        { firstName: req.body.firstName, lastName: req.body.lastName },
        req.protocol + '://' + req.get('host'),
      );
      res.status(200).send(payload);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: error.message || 'Signup failed. Please try again.' });
    }
  }),
);

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
    const user = req.currentUser; 
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user); 
  })
);


router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
