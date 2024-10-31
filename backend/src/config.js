const os = require('os');

const config = {
  bcrypt: {
    saltRounds: 12,
  },
  admin_pass: process.env.ADMIN_PASS,
  admin_email: process.env.ADMIN_EMAIL,
  providers: {
    LOCAL: 'local',
  },
  secret_key: process.env.JWT_SECRET || 'HUEyqESqgQ1yTwzVlO6wprC9Kf1J1xuA',
  remote: '',
  port: process.env.NODE_ENV === 'production' ? '' : '8080',
  hostUI: process.env.NODE_ENV === 'production' ? '' : 'http://localhost',
  portUI: process.env.NODE_ENV === 'production' ? '' : '3000',

  portUIProd: process.env.NODE_ENV === 'production' ? '/#' : ':3000/#',

  swaggerUI: process.env.NODE_ENV === 'production' ? '' : 'http://localhost',
  swaggerPort: process.env.NODE_ENV === 'production' ? '' : ':8080',
  uploadDir: os.tmpdir(),

  sendgridApiKey: process.env.SENDGRID_API_KEY, 
  emailFrom: process.env.EMAIL_FROM, 
  emailPassword: process.env.EMAIL_PASS,
  roles: {
    admin: 'Administrator',
    user: 'User',
    agent: 'Agent'
  },
  project_uuid: '19140a4d-00be-4309-990f-10d5657adaf6',
  
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
};

config.host =
  process.env.NODE_ENV === 'production' ? config.remote : 'http://localhost';
config.apiUrl = `${config.host}${config.port ? `:${config.port}` : ``}/api`;
config.swaggerUrl = `${config.swaggerUI}${config.swaggerPort}`;
config.uiUrl = `${config.hostUI}${config.portUI ? `:${config.portUI}` : ``}/#`;
config.backUrl = `${config.hostUI}${config.portUI ? `:${config.portUI}` : ``}`;

module.exports = config;