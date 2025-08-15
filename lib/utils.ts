import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { decryptResponse, isEncryptedResponse } from './utils/encryption.utils'
import { shouldEncryptEndpoint, shouldLogStats } from './config/encryption.config'
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
    return (number / 1_000_000_000).toFixed(2).replace(/\.0$/, '') + 'B';
  }
  if (Math.abs(number) >= 1_000_000) {
    return (number / 1_000_000).toFixed(2).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(number) >= 1_000) {
    return (number / 1_000).toFixed(2).replace(/\.0$/, '') + 'K';
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

export function safeFormatDate(dateString: string | number | undefined | null): string {
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


// Clear all authentication data to fix infinite loop issue
export function clearAllAuthData() {
  if (typeof window === 'undefined') return;
  
  // Clear all localStorage authentication items
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('jwt');
  
  // Clear OIDC session storage
  const oidcKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('oidc.') || 
    key.includes('authority') ||
    key.includes('client_id')
  );
  oidcKeys.forEach(key => localStorage.removeItem(key));
  
  // Clear session storage as well
  if (sessionStorage) {
    const sessionKeys = Object.keys(sessionStorage).filter(key => 
      key.startsWith('oidc.') || 
      key.includes('authority') ||
      key.includes('client_id')
    );
    sessionKeys.forEach(key => sessionStorage.removeItem(key));
  }
  
  console.log('🧹 Cleared all authentication data');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(endpoint)
  
  const shouldEncrypt = shouldEncryptEndpoint(endpoint);
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(shouldEncrypt && { 'X-Encrypted-Response': 'true' }),
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

    // console.log("RESP", response); // Removed for performance
    if (response.status === 401) {
      console.log('🚨 401 Unauthorized - Clearing all auth data');
      
      // Clear ALL authentication data (OIDC + admin tokens)
      clearAllAuthData();
      
      // Force trigger auth state re-evaluation by dispatching a storage event
      // This ensures AuthProvider immediately recognizes the user is no longer authenticated
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'authToken',
        oldValue: token,
        newValue: null,
        storageArea: localStorage
      }));
      
      // Add a small delay to allow auth state to update
      setTimeout(() => {
        const currentPath = window.location.pathname;
        const isOnAdminPage = currentPath.includes('/admin');
        const isOnLoginPage = currentPath === '/admin' || currentPath === '/';
        
        // Only redirect if we're not already on a login page to prevent loops
        if (!isOnLoginPage) {
          if (isOnAdminPage) {
            // If we're on an admin page, redirect to admin login
            console.log('🔄 Redirecting to admin login');
            window.location.href = '/admin';
          } else {
            // If we're on a regular page, redirect to main landing
            console.log('🔄 Redirecting to landing page');
            window.location.href = '/';
          }
        } else {
          // If we're already on a login page, just reload to reset state
          console.log('🔄 Reloading current page to reset state');
          window.location.reload();
        }
      }, 100); // Small delay to ensure auth state updates
      
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jsonData = await response.json()
    
    // Check if encryption was skipped due to smart compression
    const encryptionSkipped = response.headers.get('X-Encryption-Skipped');
    if (encryptionSkipped && shouldLogStats()) {
      const originalSize = response.headers.get('X-Original-Size');
      const wouldBeSize = response.headers.get('X-Would-Be-Size');
      const reason = response.headers.get('X-Encryption-Reason');
      const potentialSavings = response.headers.get('X-Potential-Savings');
      
      if (encryptionSkipped === 'insufficient-benefit' && originalSize && wouldBeSize) {
        const savingsText = potentialSavings ? `, would save ${potentialSavings}B` : '';
        // console.log(`🤔 Smart compression: Encryption skipped - ${reason} (${originalSize}B → ${wouldBeSize}B${savingsText})`); // Removed for performance
      } else if (encryptionSkipped === 'error') {
        console.log('⚠️ Smart compression: Encryption skipped due to error');
      }
    }
    
    // Check if response is encrypted and decrypt it
    if (isEncryptedResponse(jsonData)) {
      if (shouldLogStats()) {
        //console.log('🔓 Decrypting encrypted response...');
      }
      
      // Log compression stats from headers if available and logging is enabled
      if (shouldLogStats()) {
        const originalSize = response.headers.get('X-Original-Size');
        const compressedSize = response.headers.get('X-Compressed-Size');
        const compressionRatio = response.headers.get('X-Compression-Ratio');
        const sizeSaved = response.headers.get('X-Size-Saved');
        
        if (originalSize && compressedSize && compressionRatio) {
          // console.log(`📊 Smart compression: ${originalSize}B → ${compressedSize}B (${compressionRatio}% reduction, saved ${sizeSaved}B)`); // Removed for performance
        }
      }
      
      try {
        const decryptedData = await decryptResponse(jsonData);
        if (shouldLogStats()) {
          //console.log('✅ Response decrypted successfully');
        }
        return decryptedData;
      } catch (error) {
        console.error('❌ Decryption failed:', error);
        throw new Error('Failed to decrypt response');
      }
    }

    return jsonData
  } catch (error) {
    console.log("ERROR!", error)
    // Optionally handle other errors here
    throw error
  }
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

export function getTimeRangeDescription(timeRange: string): { current: string; previous: string } {
  const descriptions = {
    'all-time': { current: 'all time', previous: 'baseline' },
    'this-week': { current: 'this week', previous: 'last week' },
    'last-week': { current: 'last week', previous: 'the week before' },
    'this-month': { current: 'this month', previous: 'last month' },
    'last-month': { current: 'last month', previous: 'the month before' },
    'this-quarter': { current: 'this quarter', previous: 'last quarter' },
    'last-quarter': { current: 'last quarter', previous: 'the quarter before' },
  };
  
  return descriptions[timeRange as keyof typeof descriptions] || { current: 'current period', previous: 'previous period' };
}