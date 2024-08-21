const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const db = require('./db/models');
const config = require('./config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Load environment variables
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const searchRoutes = require('./routes/search');
const openaiRoutes = require('./routes/openai');
const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const permissionsRoutes = require('./routes/permissions');
const agentsRoutes = require('./routes/agents');
const attachmentsRoutes = require('./routes/attachments');
const customersRoutes = require('./routes/customers');
const foldersRoutes = require('./routes/folders');
const mailboxesRoutes = require('./routes/mailboxes');
const messagesRoutes = require('./routes/messages');
const ticket_countsRoutes = require('./routes/ticket_counts');
const ticket_labelsRoutes = require('./routes/ticket_labels');
const ticketsRoutes = require('./routes/tickets');
const webhooksRoutes = require('./routes/webhooks');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'TMS',
      description: 'TMS Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.',
    },
    servers: [
      {
        url: config.swaggerUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  function (req, res, next) {
    swaggerUI.host = req.get('host');
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(specs),
);

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware setup
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Passport authentication
require('./auth/auth');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRoutes);
app.use('/api/roles', passport.authenticate('jwt', { session: false }), rolesRoutes);
app.use('/api/permissions', passport.authenticate('jwt', { session: false }), permissionsRoutes);
app.use('/api/agents', passport.authenticate('jwt', { session: false }), agentsRoutes);
app.use('/api/attachments', passport.authenticate('jwt', { session: false }), attachmentsRoutes);
app.use('/api/customers', passport.authenticate('jwt', { session: false }), customersRoutes);
app.use('/api/folders', passport.authenticate('jwt', { session: false }), foldersRoutes);
app.use('/api/mailboxes', passport.authenticate('jwt', { session: false }), mailboxesRoutes);
app.use('/api/messages', passport.authenticate('jwt', { session: false }), messagesRoutes);
app.use('/api/ticket_counts', passport.authenticate('jwt', { session: false }), ticket_countsRoutes);
app.use('/api/ticket_labels', passport.authenticate('jwt', { session: false }), ticket_labelsRoutes);
app.use('/api/tickets', passport.authenticate('jwt', { session: false }), ticketsRoutes);
app.use('/api/webhooks', passport.authenticate('jwt', { session: false }), webhooksRoutes);
app.use('/api/openai', passport.authenticate('jwt', { session: false }), openaiRoutes);
app.use('/api/search', passport.authenticate('jwt', { session: false }), searchRoutes);

// Serve static files
const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(publicDir, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
