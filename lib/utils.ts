import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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