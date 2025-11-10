// API route for managing habits
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB, formatDate } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = getDB();

  try {
    // GET: Fetch all habits with today's completion status
    if (req.method === 'GET') {
      const today = formatDate();

      const habits = await db.execute({
        sql: `
          SELECT
            h.id,
            h.title,
            h.description,
            h.order_index,
            h.is_active,
            COALESCE(hl.completed, 0) as completed,
            hl.notes
          FROM habits h
          LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.date = ?
          WHERE h.is_active = 1
          ORDER BY h.order_index ASC
        `,
        args: [today],
      });

      return res.status(200).json(habits.rows);
    }

    // POST: Create a new habit
    if (req.method === 'POST') {
      const { title, description, order_index } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const result = await db.execute({
        sql: 'INSERT INTO habits (title, description, order_index) VALUES (?, ?, ?)',
        args: [title, description || '', order_index || 999],
      });

      return res.status(201).json({ id: result.lastInsertRowid, title });
    }

    // PUT: Update a habit
    if (req.method === 'PUT') {
      const { id, title, description, order_index, is_active } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Habit ID is required' });
      }

      await db.execute({
        sql: `
          UPDATE habits
          SET title = ?, description = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [title, description, order_index, is_active ? 1 : 0, id],
      });

      return res.status(200).json({ success: true });
    }

    // DELETE: Delete a habit
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Habit ID is required' });
      }

      await db.execute({
        sql: 'DELETE FROM habits WHERE id = ?',
        args: [id as string],
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Habits API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
