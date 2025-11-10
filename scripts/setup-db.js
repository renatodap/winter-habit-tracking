// Database setup script for Turso
// Run this after creating your Turso database and setting environment variables

const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
    console.log('1. Create a Turso account at https://turso.tech');
    console.log('2. Create a database: turso db create winter-arc');
    console.log('3. Get the URL: turso db show winter-arc');
    console.log('4. Create a token: turso db tokens create winter-arc');
    console.log('5. Add these to your .env file');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = createClient({ url, authToken });

  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      await client.execute(statement);
    }

    console.log('✅ Database setup complete!');
    console.log('Default habits and reminders have been created.');

    // Verify setup
    const result = await client.execute('SELECT COUNT(*) as count FROM habits');
    console.log(`Habits in database: ${result.rows[0].count}`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
