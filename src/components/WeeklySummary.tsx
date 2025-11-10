// Weekly summary showing trends and averages
import React from 'react';
import type { NumericLog } from '@/hooks/useLogs';

interface WeeklySummaryProps {
  weeklyLogs: NumericLog[];
}

export default function WeeklySummary({ weeklyLogs }: WeeklySummaryProps) {
  // Calculate averages
  const validCalories = weeklyLogs.filter(log => log.calories).map(log => log.calories!);
  const validProtein = weeklyLogs.filter(log => log.protein).map(log => log.protein!);
  const validWeight = weeklyLogs.filter(log => log.weight).map(log => log.weight!);

  const avgCalories = validCalories.length
    ? Math.round(validCalories.reduce((a, b) => a + b, 0) / validCalories.length)
    : 0;

  const avgProtein = validProtein.length
    ? Math.round(validProtein.reduce((a, b) => a + b, 0) / validProtein.length)
    : 0;

  // Calculate weight change
  let weightChange = 0;
  if (validWeight.length >= 2) {
    const sorted = [...validWeight].sort();
    weightChange = sorted[0] - sorted[sorted.length - 1];
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Summary</h3>

      <div className="space-y-4">
        {/* Weight change */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Weight Change</span>
          <span
            className={`text-lg font-bold ${
              weightChange > 0
                ? 'text-green-600'
                : weightChange < 0
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {weightChange > 0 ? '−' : weightChange < 0 ? '+' : ''}
            {Math.abs(weightChange).toFixed(1)} kg
          </span>
        </div>

        {/* Average deficit */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Avg Daily Deficit</span>
          <span className="text-lg font-bold text-gray-900">
            {avgCalories > 0 ? `−${avgCalories}` : avgCalories} cal
          </span>
        </div>

        {/* Average protein */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Avg Protein</span>
          <span className="text-lg font-bold text-gray-900">{avgProtein}g</span>
        </div>

        {/* Days logged */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Days Tracked</span>
          <span className="text-lg font-bold text-gray-900">{weeklyLogs.length} / 7</span>
        </div>
      </div>
    </div>
  );
}
