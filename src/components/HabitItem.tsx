// Individual habit checkbox component
import React from 'react';
import type { Habit } from '@/hooks/useHabits';

interface HabitItemProps {
  habit: Habit;
  onToggle: (habitId: number, completed: boolean) => void;
}

export default function HabitItem({ habit, onToggle }: HabitItemProps) {
  const isCompleted = habit.completed === 1;

  return (
    <button
      onClick={() => onToggle(habit.id, !isCompleted)}
      className={`
        w-full p-4 rounded-xl text-left transition-all duration-200
        flex items-center gap-4 touch-manipulation
        ${
          isCompleted
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-[0.98]'
            : 'bg-white hover:bg-gray-50 text-gray-800 shadow-md hover:shadow-lg active:scale-95'
        }
      `}
      aria-label={`${habit.title} - ${isCompleted ? 'completed' : 'not completed'}`}
    >
      {/* Checkbox */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center
          transition-all duration-200
          ${
            isCompleted
              ? 'bg-white border-white'
              : 'border-gray-300 bg-white'
          }
        `}
      >
        {isCompleted && (
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            text-base font-medium truncate
            ${isCompleted ? 'text-white' : 'text-gray-900'}
          `}
        >
          {habit.title}
        </p>
        {habit.description && (
          <p
            className={`
              text-sm mt-0.5 truncate
              ${isCompleted ? 'text-green-100' : 'text-gray-500'}
            `}
          >
            {habit.description}
          </p>
        )}
      </div>
    </button>
  );
}
