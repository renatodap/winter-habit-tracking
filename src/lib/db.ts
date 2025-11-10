// Database client setup for Turso/LibSQL
import { createClient } from '@libsql/client';

// Singleton database client
let dbClient: ReturnType<typeof createClient> | null = null;

export function getDB() {
  if (!dbClient) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error('TURSO_DATABASE_URL is not set');
    }

    dbClient = createClient({
      url,
      authToken,
    });
  }

  return dbClient;
}

// Initialize database with schema
export async function initializeDatabase() {
  const db = getDB();

  // Note: Schema is applied via Turso CLI or setup script
  // This function is mainly for verification
  try {
    await db.execute('SELECT 1 FROM habits LIMIT 1');
    console.log('Database connection verified');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to format dates consistently
export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Calculate date range for weekly queries
export function getWeekDateRange(endDate: Date = new Date()): [string, string] {
  const end = formatDate(endDate);
  const start = new Date(endDate);
  start.setDate(start.getDate() - 6); // Last 7 days including today
  return [formatDate(start), end];
}
