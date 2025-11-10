// API route for managing notification reminders
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = getDB();

  try {
    // GET: Fetch all reminders
    if (req.method === 'GET') {
      const reminders = await db.execute({
        sql: 'SELECT * FROM reminders ORDER BY time ASC',
        args: [],
      });

      return res.status(200).json(reminders.rows);
    }

    // POST: Create a new reminder
    if (req.method === 'POST') {
      const { title, time, enabled, days_of_week } = req.body;

      if (!title || !time) {
        return res.status(400).json({ error: 'Title and time are required' });
      }

      const result = await db.execute({
        sql: 'INSERT INTO reminders (title, time, enabled, days_of_week) VALUES (?, ?, ?, ?)',
        args: [title, time, enabled ? 1 : 0, days_of_week || '0,1,2,3,4,5,6'],
      });

      return res.status(201).json({ id: result.lastInsertRowid, title });
    }

    // PUT: Update a reminder
    if (req.method === 'PUT') {
      const { id, title, time, enabled, days_of_week } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Reminder ID is required' });
      }

      await db.execute({
        sql: `
          UPDATE reminders
          SET title = ?, time = ?, enabled = ?, days_of_week = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [title, time, enabled ? 1 : 0, days_of_week, id],
      });

      return res.status(200).json({ success: true });
    }

    // DELETE: Delete a reminder
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Reminder ID is required' });
      }

      await db.execute({
        sql: 'DELETE FROM reminders WHERE id = ?',
        args: [id as string],
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Reminders API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
