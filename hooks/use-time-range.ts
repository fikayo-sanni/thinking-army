import { useState, useEffect } from "react";

const STORAGE_KEY = "dashboardTimeRange";

export function useTimeRange(defaultValue = "this-week") {
  const [timeRange, setTimeRange] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || defaultValue;
    }
    return defaultValue;
  });

  // Update localStorage when timeRange changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, timeRange);
    }
  }, [timeRange]);

  // Listen for storage changes (from other components or tabs)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        setTimeRange(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return [timeRange, setTimeRange] as const;
} 