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