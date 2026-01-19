import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for auto-refreshing data at specified intervals
 * @param refetchFn - Function to call for refreshing data
 * @param intervalMs - Interval in milliseconds (default: 30000 = 30s)
 * @param enabled - Whether auto-refresh is enabled (default: true)
 */
export function useAutoRefresh(
  refetchFn: () => void | Promise<void>,
  intervalMs: number = 30000,
  enabled: boolean = true
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const refetchRef = useRef(refetchFn);

  // Keep refetch function reference up to date
  useEffect(() => {
    refetchRef.current = refetchFn;
  }, [refetchFn]);

  const startRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      refetchRef.current();
    }, intervalMs);
  }, [intervalMs]);

  const stopRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const manualRefresh = useCallback(() => {
    refetchRef.current();
  }, []);

  useEffect(() => {
    if (enabled) {
      startRefresh();
    } else {
      stopRefresh();
    }

    return () => {
      stopRefresh();
    };
  }, [enabled, startRefresh, stopRefresh]);

  // Pause refresh when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopRefresh();
      } else if (enabled) {
        manualRefresh(); // Refresh immediately when tab becomes visible
        startRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, startRefresh, stopRefresh, manualRefresh]);

  return {
    manualRefresh,
    startRefresh,
    stopRefresh,
  };
}

export default useAutoRefresh;
