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

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const searchRoutes = require('./routes/search');

const openaiRoutes = require('./routes/openai');

const usersRoutes = require('./routes/users');

const rolesRoutes = require('./routes/roles');

const permissionsRoutes = require('./routes/permissions');

const usersRoutes = require('./routes/users');

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
      description:
        'TMS Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.',
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

app.use(cors({ origin: true }));
require('./auth/auth');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoutes,
);

app.use(
  '/api/roles',
  passport.authenticate('jwt', { session: false }),
  rolesRoutes,
);

app.use(
  '/api/permissions',
  passport.authenticate('jwt', { session: false }),
  permissionsRoutes,
);

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoutes,
);

app.use(
  '/api/agents',
  passport.authenticate('jwt', { session: false }),
  agentsRoutes,
);

app.use(
  '/api/attachments',
  passport.authenticate('jwt', { session: false }),
  attachmentsRoutes,
);

app.use(
  '/api/customers',
  passport.authenticate('jwt', { session: false }),
  customersRoutes,
);

app.use(
  '/api/folders',
  passport.authenticate('jwt', { session: false }),
  foldersRoutes,
);

app.use(
  '/api/mailboxes',
  passport.authenticate('jwt', { session: false }),
  mailboxesRoutes,
);

app.use(
  '/api/messages',
  passport.authenticate('jwt', { session: false }),
  messagesRoutes,
);

app.use(
  '/api/ticket_counts',
  passport.authenticate('jwt', { session: false }),
  ticket_countsRoutes,
);

app.use(
  '/api/ticket_labels',
  passport.authenticate('jwt', { session: false }),
  ticket_labelsRoutes,
);

app.use(
  '/api/tickets',
  passport.authenticate('jwt', { session: false }),
  ticketsRoutes,
);

app.use(
  '/api/webhooks',
  passport.authenticate('jwt', { session: false }),
  webhooksRoutes,
);

app.use(
  '/api/openai',
  passport.authenticate('jwt', { session: false }),
  openaiRoutes,
);

app.use(
  '/api/search',
  passport.authenticate('jwt', { session: false }),
  searchRoutes,
);

const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
