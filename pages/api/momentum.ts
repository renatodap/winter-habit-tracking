// API route for calculating momentum stats and weekly averages
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB, formatDate, getWeekDateRange } from '@/lib/db';

interface MomentumData {
  currentStreak: number;
  completionRate: number;
  todayCompleted: number;
  todayTotal: number;
  weekCompleted: number;
  weekTotal: number;
  nextAction: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MomentumData | { error: string }>
) {
  const db = getDB();

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const today = formatDate();
    const [weekStart, weekEnd] = getWeekDateRange();

    // Get today's completion stats
    const todayStats = await db.execute({
      sql: `
        SELECT
          COUNT(CASE WHEN hl.completed = 1 THEN 1 END) as completed,
          COUNT(h.id) as total
        FROM habits h
        LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.date = ?
        WHERE h.is_active = 1
      `,
      args: [today],
    });

    const todayCompleted = Number(todayStats.rows[0]?.completed || 0);
    const todayTotal = Number(todayStats.rows[0]?.total || 0);

    // Calculate current streak (consecutive days with all habits completed)
    const streakResult = await db.execute({
      sql: `
        WITH daily_completion AS (
          SELECT
            hl.date,
            COUNT(CASE WHEN hl.completed = 1 THEN 1 END) as completed_count,
            COUNT(h.id) as total_habits
          FROM habit_logs hl
          JOIN habits h ON hl.habit_id = h.id
          WHERE h.is_active = 1
          GROUP BY hl.date
          HAVING completed_count = total_habits
          ORDER BY date DESC
        )
        SELECT COUNT(*) as streak
        FROM daily_completion
        WHERE date >= date('now', '-30 days')
      `,
      args: [],
    });
    const currentStreak = Number(streakResult.rows[0]?.streak || 0);

    // Calculate completion stats for the week
    const weekStats = await db.execute({
      sql: `
        SELECT
          COUNT(CASE WHEN hl.completed = 1 THEN 1 END) as completed,
          COUNT(*) as total
        FROM habit_logs hl
        JOIN habits h ON hl.habit_id = h.id
        WHERE hl.date BETWEEN ? AND ? AND h.is_active = 1
      `,
      args: [weekStart, weekEnd],
    });

    const weekCompleted = Number(weekStats.rows[0]?.completed || 0);
    const weekTotal = Number(weekStats.rows[0]?.total || 0);
    const completionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

    // Determine next action based on time of day
    const currentHour = new Date().getHours();
    let nextAction = 'Review today\'s progress';

    if (currentHour < 12) {
      nextAction = 'Complete your morning habits';
    } else if (currentHour < 18) {
      nextAction = 'Check afternoon habits';
    } else if (currentHour < 21) {
      nextAction = 'Prepare for tomorrow';
    } else {
      nextAction = 'Complete evening check-in';
    }

    const momentum: MomentumData = {
      currentStreak,
      completionRate,
      todayCompleted,
      todayTotal,
      weekCompleted,
      weekTotal,
      nextAction,
    };

    return res.status(200).json(momentum);
  } catch (error) {
    console.error('Momentum API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
