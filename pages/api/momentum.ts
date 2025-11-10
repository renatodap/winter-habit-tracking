// API route for calculating momentum stats and weekly averages
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB, formatDate, getWeekDateRange } from '@/lib/db';

interface MomentumData {
  todayDeficit: number | null;
  weeklyAvgDeficit: number;
  weeklyWeightChange: number;
  currentStreak: number;
  completionRate: number;
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

    // Get today's deficit
    const todayLog = await db.execute({
      sql: 'SELECT calories FROM numeric_logs WHERE date = ?',
      args: [today],
    });
    const todayDeficit = todayLog.rows[0]?.calories
      ? -Number(todayLog.rows[0].calories)
      : null;

    // Calculate weekly average deficit
    const weeklyDeficit = await db.execute({
      sql: `
        SELECT AVG(CASE WHEN calories > 0 THEN -calories ELSE 0 END) as avg_deficit
        FROM numeric_logs
        WHERE date BETWEEN ? AND ? AND calories IS NOT NULL
      `,
      args: [weekStart, weekEnd],
    });
    const weeklyAvgDeficit = Number(weeklyDeficit.rows[0]?.avg_deficit || 0);

    // Calculate weekly weight change
    const weeklyWeights = await db.execute({
      sql: `
        SELECT weight, date FROM numeric_logs
        WHERE date BETWEEN ? AND ? AND weight IS NOT NULL
        ORDER BY date ASC
      `,
      args: [weekStart, weekEnd],
    });

    let weeklyWeightChange = 0;
    if (weeklyWeights.rows.length >= 2) {
      const firstWeight = Number(weeklyWeights.rows[0].weight);
      const lastWeight = Number(weeklyWeights.rows[weeklyWeights.rows.length - 1].weight);
      weeklyWeightChange = firstWeight - lastWeight; // Positive = weight loss
    }

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

    // Calculate completion rate for the week
    const completionResult = await db.execute({
      sql: `
        SELECT
          COUNT(CASE WHEN hl.completed = 1 THEN 1 END) * 100.0 / COUNT(*) as rate
        FROM habit_logs hl
        JOIN habits h ON hl.habit_id = h.id
        WHERE hl.date BETWEEN ? AND ? AND h.is_active = 1
      `,
      args: [weekStart, weekEnd],
    });
    const completionRate = Number(completionResult.rows[0]?.rate || 0);

    // Determine next action based on time of day
    const currentHour = new Date().getHours();
    let nextAction = 'Review today\'s progress';

    if (currentHour < 12) {
      nextAction = 'Log breakfast and morning workout';
    } else if (currentHour < 18) {
      nextAction = 'Prepare dinner and log protein intake';
    } else if (currentHour < 21) {
      nextAction = 'Prep tomorrow\'s meals at 9PM';
    } else {
      nextAction = 'Complete evening check-in';
    }

    const momentum: MomentumData = {
      todayDeficit,
      weeklyAvgDeficit: Math.round(weeklyAvgDeficit),
      weeklyWeightChange: Math.round(weeklyWeightChange * 10) / 10,
      currentStreak,
      completionRate: Math.round(completionRate),
      nextAction,
    };

    return res.status(200).json(momentum);
  } catch (error) {
    console.error('Momentum API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
