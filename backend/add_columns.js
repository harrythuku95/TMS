const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: console.log,
});

async function addColumns() {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='tickets'
      AND column_name IN ('closedById', 'closedAt', 'openedAt', 'pendingAt')
    `);

    const existingColumns = results.map(r => r.column_name);
    console.log('Existing columns:', existingColumns);

    if (!existingColumns.includes('closedById')) {
      console.log('Adding closedById column...');
      await sequelize.query('ALTER TABLE tickets ADD COLUMN "closedById" UUID');
    }

    if (!existingColumns.includes('closedAt')) {
      console.log('Adding closedAt column...');
      await sequelize.query('ALTER TABLE tickets ADD COLUMN "closedAt" TIMESTAMP WITH TIME ZONE');
    }

    if (!existingColumns.includes('openedAt')) {
      console.log('Adding openedAt column...');
      await sequelize.query('ALTER TABLE tickets ADD COLUMN "openedAt" TIMESTAMP WITH TIME ZONE');
    }

    if (!existingColumns.includes('pendingAt')) {
      console.log('Adding pendingAt column...');
      await sequelize.query('ALTER TABLE tickets ADD COLUMN "pendingAt" TIMESTAMP WITH TIME ZONE');
    }

    console.log('All columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addColumns();
