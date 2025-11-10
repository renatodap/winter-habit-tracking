// Hook for managing numeric logs (weight, calories, protein, etc.)
import { useState, useEffect, useCallback } from 'react';

export interface NumericLog {
  id?: number;
  date: string;
  weight?: number;
  calories?: number;
  protein?: number;
  training_minutes?: number;
  sleep_hours?: number;
}

export function useLogs() {
  const [todayLog, setTodayLog] = useState<NumericLog | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<NumericLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayLog = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/numeric-logs');
      if (!response.ok) throw new Error('Failed to fetch log');
      const data = await response.json();
      setTodayLog(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeeklyLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/numeric-logs?period=week');
      if (!response.ok) throw new Error('Failed to fetch weekly logs');
      const data = await response.json();
      setWeeklyLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const updateLog = useCallback(async (updates: Partial<NumericLog>) => {
    try {
      const response = await fetch('/api/numeric-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update log');

      // Optimistically update UI
      setTodayLog(prev => (prev ? { ...prev, ...updates } : { date: new Date().toISOString().split('T')[0], ...updates }));

      // Refresh weekly logs
      await fetchWeeklyLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      await fetchTodayLog();
    }
  }, [fetchTodayLog, fetchWeeklyLogs]);

  useEffect(() => {
    fetchTodayLog();
    fetchWeeklyLogs();
  }, [fetchTodayLog, fetchWeeklyLogs]);

  return {
    todayLog,
    weeklyLogs,
    loading,
    error,
    updateLog,
    refetch: fetchTodayLog,
  };
}
