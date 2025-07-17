import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { buildApiUrl } from './api-constants'
import { parseISO, format, getISOWeek } from "date-fns";
import type { ChartData as PurchaseChartData } from './services/purchases-service';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function for consistent date formatting to prevent hydration errors
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
  
  return new Date(date).toLocaleDateString("en-US", options || defaultOptions)
}

// Utility function for consistent date formatting with time
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatThousands(value: string | number): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US').format(number);
}

export function formatShortNumber(value: string | number): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(number)) return String(value);
  if (Math.abs(number) >= 1_000_000_000) {
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (Math.abs(number) >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(number) >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(number);
}

export function groupChartData(
  data: PurchaseChartData[],
  groupBy: 'day' | 'week' | 'month'
): PurchaseChartData[] {
  const grouped: { [key: string]: PurchaseChartData } = {};
  data.forEach((item) => {
    let key: string;
    if (groupBy === "month") {
      key = format(parseISO(item.date), "yyyy-MM");
    } else if (groupBy === "week") {
      const date = parseISO(item.date);
      key = `${format(date, "yyyy")}-W${getISOWeek(date)}`;
    } else {
      key = format(parseISO(item.date), "yyyy-MM-dd");
    }
    if (!grouped[key]) {
      grouped[key] = { ...item, date: key, purchases: 0, volume: 0 };
    }
    grouped[key].purchases += item.purchases;
    grouped[key].volume += item.volume;
  });
  return Object.values(grouped);
}

export function formatXAxisLabel(
  dateKey: string,
  groupBy: 'day' | 'week' | 'month'
): string {
  if (groupBy === "month") {
    // dateKey: "2024-06"
    return format(parseISO(dateKey + "-01"), "MMM yyyy");
  }
  if (groupBy === "week") {
    // dateKey: "2024-W23"
    const [year, week] = dateKey.split("-W");
    return `W${week} ${year}`;
  }
  // dateKey: "2024-06-05"
  return format(parseISO(dateKey), "MMM d");
}


export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(endpoint)
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)

    console.log("RESP", response);
    if (response.status === 401) {
      // Remove session/token
      localStorage.removeItem('authToken');
      // Optionally clear other session data here
      // Redirect to login
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.log("ERROR!", error)
    // Optionally handle other errors here
    throw error
  }
}