// API route for logging habit completions
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB, formatDate } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = getDB();

  try {
    // POST: Toggle habit completion for a specific date
    if (req.method === 'POST') {
      const { habit_id, date, completed, notes } = req.body;
      const logDate = date || formatDate();

      if (!habit_id) {
        return res.status(400).json({ error: 'Habit ID is required' });
      }

      // Upsert: insert or update if exists
      await db.execute({
        sql: `
          INSERT INTO habit_logs (habit_id, date, completed, notes)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(habit_id, date) DO UPDATE SET
            completed = excluded.completed,
            notes = excluded.notes
        `,
        args: [habit_id, logDate, completed ? 1 : 0, notes || ''],
      });

      return res.status(200).json({ success: true });
    }

    // GET: Fetch habit logs for a date range
    if (req.method === 'GET') {
      const { start_date, end_date } = req.query;
      const endDate = (end_date as string) || formatDate();
      const startDate = (start_date as string) || formatDate();

      const logs = await db.execute({
        sql: `
          SELECT hl.*, h.title
          FROM habit_logs hl
          JOIN habits h ON hl.habit_id = h.id
          WHERE hl.date BETWEEN ? AND ?
          ORDER BY hl.date DESC, h.order_index ASC
        `,
        args: [startDate, endDate],
      });

      return res.status(200).json(logs.rows);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Habit logs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
