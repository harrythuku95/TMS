require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('./auth/auth');
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

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const usersRoutes = require('./routes/users');
const customersRoutes = require('./routes/customers');
const ticketsRoutes = require('./routes/tickets');

const { setCurrentUser } = require('./middlewares/checkRole');

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

app.use(passport.initialize());

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
  origin: ['http://localhost:5173', 'http://172.20.0.4:5173'],
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
  max: 1000
});
app.use(limiter);

// Passport authentication
require('./auth/auth');

app.use(setCurrentUser);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRoutes);
app.use('/api/customers', passport.authenticate('jwt', { session: false }), customersRoutes);
app.use('/api/tickets', passport.authenticate('jwt', { session: false }), ticketsRoutes);

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
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

const PORT = process.env.PORT || 8080;

console.log('Database config:', {
  username: config.development.username,
  password: config.development.password ? '[REDACTED]' : 'null',
  database: config.development.database,
  host: config.development.host,
});

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});

module.exports = app;