import { useState, useEffect } from "react";

const STORAGE_KEY = "dashboardTimeRange";

export function useTimeRange(defaultValue = "this-week") {
  const [timeRange, setTimeRange] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || defaultValue;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, timeRange);
    }
  }, [timeRange]);

  return [timeRange, setTimeRange] as const;
} 