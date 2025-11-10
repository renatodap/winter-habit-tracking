// Hook for managing habits and habit logs
import { useState, useEffect, useCallback } from 'react';

export interface Habit {
  id: number;
  title: string;
  description: string;
  order_index: number;
  is_active: number;
  completed: number;
  notes?: string;
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/habits');
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleHabit = useCallback(async (habitId: number, completed: boolean) => {
    try {
      const response = await fetch('/api/habit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habit_id: habitId, completed }),
      });

      if (!response.ok) throw new Error('Failed to update habit');

      // Optimistically update UI
      setHabits(prev =>
        prev.map(h => (h.id === habitId ? { ...h, completed: completed ? 1 : 0 } : h))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Revert on error
      await fetchHabits();
    }
  }, [fetchHabits]);

  const completeAllHabits = useCallback(async () => {
    try {
      const promises = habits.map(habit =>
        fetch('/api/habit-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ habit_id: habit.id, completed: true }),
        })
      );

      await Promise.all(promises);

      // Update all habits to completed
      setHabits(prev => prev.map(h => ({ ...h, completed: 1 })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      await fetchHabits();
    }
  }, [habits, fetchHabits]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    habits,
    loading,
    error,
    toggleHabit,
    completeAllHabits,
    refetch: fetchHabits,
  };
}
