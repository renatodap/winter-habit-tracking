// Hook for calculating momentum and weekly stats
import { useState, useEffect, useCallback } from 'react';

export interface MomentumData {
  todayDeficit: number | null;
  weeklyAvgDeficit: number;
  weeklyWeightChange: number;
  currentStreak: number;
  completionRate: number;
  nextAction: string;
}

export function useMomentum() {
  const [momentum, setMomentum] = useState<MomentumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMomentum = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/momentum');
      if (!response.ok) throw new Error('Failed to fetch momentum');
      const data = await response.json();
      setMomentum(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMomentum();

    // Refresh momentum every 5 minutes
    const interval = setInterval(fetchMomentum, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchMomentum]);

  return {
    momentum,
    loading,
    error,
    refetch: fetchMomentum,
  };
}
