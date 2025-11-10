// API route for numeric metrics (weight, calories, protein, etc.)
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB, formatDate, getWeekDateRange } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = getDB();

  try {
    // GET: Fetch numeric logs
    if (req.method === 'GET') {
      const { period } = req.query;

      if (period === 'week') {
        const [startDate, endDate] = getWeekDateRange();
        const logs = await db.execute({
          sql: `
            SELECT * FROM numeric_logs
            WHERE date BETWEEN ? AND ?
            ORDER BY date DESC
          `,
          args: [startDate, endDate],
        });
        return res.status(200).json(logs.rows);
      }

      // Get today's log
      const today = formatDate();
      const result = await db.execute({
        sql: 'SELECT * FROM numeric_logs WHERE date = ?',
        args: [today],
      });

      return res.status(200).json(result.rows[0] || null);
    }

    // POST: Create or update numeric log for a date
    if (req.method === 'POST') {
      const { date, weight, calories, protein, training_minutes, sleep_hours } = req.body;
      const logDate = date || formatDate();

      await db.execute({
        sql: `
          INSERT INTO numeric_logs (date, weight, calories, protein, training_minutes, sleep_hours)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(date) DO UPDATE SET
            weight = COALESCE(excluded.weight, weight),
            calories = COALESCE(excluded.calories, calories),
            protein = COALESCE(excluded.protein, protein),
            training_minutes = COALESCE(excluded.training_minutes, training_minutes),
            sleep_hours = COALESCE(excluded.sleep_hours, sleep_hours),
            updated_at = CURRENT_TIMESTAMP
        `,
        args: [logDate, weight, calories, protein, training_minutes, sleep_hours],
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Numeric logs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
