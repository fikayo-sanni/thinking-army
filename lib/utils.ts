import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatThousands(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US').format(num);
}

export function safeFormatDate(dateString: string | number | Date | undefined): string {
  if (!dateString) return '-';
  
  try {
    // Handle timestamp (seconds or milliseconds)
    const timestamp = typeof dateString === 'number'
      ? dateString > 9999999999 ? dateString : dateString * 1000 // Convert seconds to milliseconds if needed
      : new Date(dateString).getTime();

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '-';
    
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatShortNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function formatXAxisLabel(date: string, groupBy: 'day' | 'week' | 'month'): string {
  const d = new Date(date);
  switch (groupBy) {
    case 'day':
      return format(d, 'MMM d');
    case 'week':
      return format(d, 'MMM d');
    case 'month':
      return format(d, 'MMM yyyy');
    default:
      return format(d, 'MMM d, yyyy');
  }
}

export function groupChartData(data: any[], groupBy: 'day' | 'week' | 'month'): any[] {
  if (!data || !data.length) return [];

  const groupedData = data.reduce((acc, item) => {
    const date = new Date(item.date);
    let key: string;

    switch (groupBy) {
      case 'day':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        key = format(date, 'yyyy-[W]ww');
        break;
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      default:
        key = format(date, 'yyyy-MM-dd');
    }

    if (!acc[key]) {
      acc[key] = {
        date: item.date,
        purchases: 0,
        volume: 0,
      };
    }

    acc[key].purchases += item.purchases || 0;
    acc[key].volume += item.volume || 0;

    return acc;
  }, {});

  return Object.values(groupedData).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
} 