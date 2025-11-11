// Weekly summary showing trends and completion stats
import React from 'react';

interface WeeklySummaryProps {
  weekCompleted: number;
  weekTotal: number;
  currentStreak: number;
}

export default function WeeklySummary({ weekCompleted, weekTotal, currentStreak }: WeeklySummaryProps) {
  const completionRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Summary</h3>

      <div className="space-y-4">
        {/* Completion rate */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Completion Rate</span>
          <span className="text-lg font-bold text-gray-900">{completionRate}%</span>
        </div>

        {/* Habits completed */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Habits Completed</span>
          <span className="text-lg font-bold text-gray-900">
            {weekCompleted} / {weekTotal}
          </span>
        </div>

        {/* Current streak */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Current Streak</span>
          <span className={`text-lg font-bold ${currentStreak > 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>

      </div>
    </div>
  );
}
