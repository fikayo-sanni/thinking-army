import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { buildApiUrl } from './api-constants'

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