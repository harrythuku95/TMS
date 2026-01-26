#!/usr/bin/env node

require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcrypt');
const db = require('../src/db/models');
const config = require('../src/config');

/**
 * Create Superuser CLI Script
 *
 * Creates an Admin user directly via the database, bypassing the
 * "first user becomes admin" logic in the signup service.
 *
 * Usage:
 *   Interactive mode: yarn createsuperuser
 *   Non-interactive: yarn createsuperuser --email admin@example.com --password secure123
 */

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        parsed[key] = value;
        i++;
      }
    }
  }

  return parsed;
}

// Display help message
function showHelp() {
  console.log(`
Create Superuser CLI

Creates an Admin user directly in the database.

Usage:
  yarn createsuperuser                    Interactive mode
  yarn createsuperuser [options]          Non-interactive mode

Options:
  --email <email>           User email address
  --password <password>     User password (min 6 characters)
  --firstName <name>        First name (optional)
  --lastName <name>         Last name (optional)
  --help, -h                Display this help message

Examples:
  yarn createsuperuser
  yarn createsuperuser --email admin@example.com --password secure123
  yarn createsuperuser --email admin@test.com --password pass123 --firstName John --lastName Doe
`);
}

// Validate email format
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Validate password length
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return false;
  }
  const length = password.length;
  return length >= 6 && length <= 100;
}

// Check if email already exists in database
async function checkEmailExists(email) {
  try {
    const user = await db.users.findOne({
      where: {
        email: email.trim()
      }
    });
    return !!user;
  } catch (error) {
    console.error('Error checking email:', error.message);
    throw error;
  }
}

// Create readline interface for interactive mode
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Wrapper for readline question as Promise
function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Interactive mode - collect user input
async function collectUserInput(rl) {
  const userData = {};

  // Email prompt with validation
  while (true) {
    const email = await question(rl, 'Email address: ');

    if (!validateEmail(email)) {
      console.log('Error: Invalid email format. Please try again.');
      continue;
    }

    const exists = await checkEmailExists(email);
    if (exists) {
      console.log('Error: A user with this email already exists.');
      continue;
    }

    userData.email = email.trim();
    break;
  }

  // Password prompt with validation
  while (true) {
    const password = await question(rl, 'Password (min 6 characters): ');

    if (!validatePassword(password)) {
      console.log('Error: Password must be between 6 and 100 characters.');
      continue;
    }

    userData.password = password;
    break;
  }

  // Optional first name
  const firstName = await question(rl, 'First name (optional): ');
  userData.firstName = firstName.trim() || null;

  // Optional last name
  const lastName = await question(rl, 'Last name (optional): ');
  userData.lastName = lastName.trim() || null;

  return userData;
}

// Validate command-line arguments for non-interactive mode
async function validateArgs(args) {
  const errors = [];

  if (!args.email) {
    errors.push('--email is required');
  } else if (!validateEmail(args.email)) {
    errors.push('Invalid email format');
  } else {
    const exists = await checkEmailExists(args.email);
    if (exists) {
      errors.push('A user with this email already exists');
    }
  }

  if (!args.password) {
    errors.push('--password is required');
  } else if (!validatePassword(args.password)) {
    errors.push('Password must be between 6 and 100 characters');
  }

  return errors;
}

// Create the superuser in the database
async function createSuperuser(userData) {
  const transaction = await db.sequelize.transaction();

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(
      userData.password,
      config.bcrypt.saltRounds
    );

    // Create the user with Admin role
    const user = await db.users.create({
      email: userData.email.trim(),
      password: hashedPassword,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      role: 'Admin',
      emailVerified: true,
      disabled: false,
      provider: 'local'
    }, { transaction });

    await transaction.commit();

    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// Main function
async function main() {
  const args = parseArgs();

  // Show help if requested
  if (args.help) {
    showHelp();
    process.exit(0);
  }

  let rl = null;

  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('Database connection established.\n');

    let userData;

    // Determine if running in interactive or non-interactive mode
    const isInteractive = !args.email && !args.password;

    if (isInteractive) {
      // Interactive mode
      console.log('Creating superuser (Admin role)...\n');
      rl = createReadlineInterface();
      userData = await collectUserInput(rl);
    } else {
      // Non-interactive mode
      const validationErrors = await validateArgs(args);

      if (validationErrors.length > 0) {
        console.error('Validation errors:');
        validationErrors.forEach(err => console.error(`  - ${err}`));
        console.error('\nUse --help for usage information.');
        process.exit(1);
      }

      userData = {
        email: args.email,
        password: args.password,
        firstName: args.firstName || null,
        lastName: args.lastName || null
      };
    }

    // Create the superuser
    console.log('\nCreating superuser...');
    const user = await createSuperuser(userData);

    // Success message
    console.log('\nSuperuser created successfully!');
    console.log('-----------------------------------');
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    if (user.firstName) console.log(`First Name: ${user.firstName}`);
    if (user.lastName) console.log(`Last Name: ${user.lastName}`);
    console.log(`Email Verified: ${user.emailVerified}`);
    console.log('-----------------------------------\n');

    process.exit(0);

  } catch (error) {
    console.error('\nError creating superuser:');

    // Handle specific error types
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation error:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path}: ${err.message}`);
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('  - A user with this email already exists.');
    } else if (error.name === 'SequelizeConnectionError') {
      console.error('  - Database connection failed. Please check your database configuration.');
    } else {
      console.error(`  - ${error.message}`);
    }

    process.exit(1);
  } finally {
    // Clean up
    if (rl) {
      rl.close();
    }
    if (db.sequelize) {
      await db.sequelize.close();
    }
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', async () => {
  console.log('\n\nOperation cancelled by user.');
  if (db.sequelize) {
    await db.sequelize.close();
  }
  process.exit(0);
});

// Run the script
main();
