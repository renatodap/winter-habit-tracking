// Banner showing momentum statement and key metrics
import React from 'react';
import type { MomentumData } from '@/hooks/useMomentum';

interface MomentumBannerProps {
  momentum: MomentumData;
}

export default function MomentumBanner({ momentum }: MomentumBannerProps) {
  const {
    todayCompleted,
    todayTotal,
    currentStreak,
    completionRate,
    nextAction,
  } = momentum;

  const todayPercentage = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 shadow-xl text-white">
      {/* Main statement */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-blue-200 mb-1">Today's Progress</h2>
        <p className="text-xl font-bold leading-tight">
          {todayCompleted} of {todayTotal} habits completed ({todayPercentage}%)
        </p>
        <p className="text-blue-200 mt-2 text-sm">
          Next: <span className="font-semibold text-white">{nextAction}</span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-blue-500">
        <div>
          <p className="text-xs text-blue-200 mb-1">Current Streak</p>
          <p className="text-lg font-bold">{currentStreak} days</p>
        </div>
        <div>
          <p className="text-xs text-blue-200 mb-1">Week Completion</p>
          <p className="text-lg font-bold">{completionRate}%</p>
        </div>
      </div>
    </div>
  );
}
