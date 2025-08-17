'use client';

import { useState, useEffect } from 'react';

type TimeRange = 'all-time' | 'this-week' | 'this-month' | 'this-quarter' | 'last-week' | 'last-month' | 'last-quarter';

export function useTimeRange(defaultRange: TimeRange = 'this-week'): [TimeRange, (range: TimeRange) => void] {
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultRange);

  useEffect(() => {
    const stored = localStorage.getItem('timeRange');
    if (stored && isValidTimeRange(stored)) {
      setTimeRange(stored as TimeRange);
    }
  }, []);

  const updateTimeRange = (range: TimeRange) => {
    setTimeRange(range);
    localStorage.setItem('timeRange', range);
  };

  return [timeRange, updateTimeRange];
}

function isValidTimeRange(range: string): range is TimeRange {
  return ['all-time', 'this-week', 'this-month', 'this-quarter', 'last-week', 'last-month', 'last-quarter'].includes(range);
} 