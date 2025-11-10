// Main app page with all features
import React, { useState } from 'react';
import Head from 'next/head';
import HabitItem from '@/components/HabitItem';
import MomentumBanner from '@/components/MomentumBanner';
import WeeklySummary from '@/components/WeeklySummary';
import ReminderSetup from '@/components/ReminderSetup';
import { useHabits } from '@/hooks/useHabits';
import { useMomentum } from '@/hooks/useMomentum';
import { useNotifications } from '@/hooks/useNotifications';

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);

  const { habits, loading: habitsLoading, toggleHabit, completeAllHabits } = useHabits();
  const { momentum } = useMomentum();
  const {
    permission,
    reminders,
    requestPermission,
    sendTestNotification,
  } = useNotifications();

  // Calculate completion stats
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <>
      <Head>
        <title>Winter Arc Habit Tracker</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Winter Arc</h1>
              <p className="text-sm text-gray-600">
                {completedCount} of {totalCount} completed ({completionPercentage}%)
              </p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Settings"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
          {/* Settings Panel */}
          {showSettings && (
            <div className="space-y-4">
              <ReminderSetup
                permission={permission}
                reminders={reminders}
                onRequestPermission={requestPermission}
                onTestNotification={sendTestNotification}
              />
            </div>
          )}

          {/* Momentum Banner */}
          {momentum && <MomentumBanner momentum={momentum} />}

          {/* Habits Checklist */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Daily Habits</h2>
              <button
                onClick={completeAllHabits}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Check All
              </button>
            </div>

            {habitsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading habits...</div>
            ) : (
              <div className="space-y-3">
                {habits.map(habit => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleHabit}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Weekly Summary */}
          {momentum && (
            <WeeklySummary
              weekCompleted={momentum.weekCompleted}
              weekTotal={momentum.weekTotal}
              currentStreak={momentum.currentStreak}
            />
          )}
        </main>

        {/* Install Prompt (for PWA) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gray-600 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              💡 Add to Home Screen for the best experience
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
