// API Base URL - Update this based on your backend environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Debug logging for API configuration
console.log('API Configuration:', {
  API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
} as const

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  OVERVIEW: '/dashboard/overview',
  STATS: '/dashboard/stats',
  CHARTS: '/dashboard/charts',
  RECENT_ACTIVITY: '/dashboard/recent-activity',
} as const

// Network endpoints
export const NETWORK_ENDPOINTS = {
  STRUCTURE: '/network/structure',
  SPONSOR: '/network/sponsor',
  DOWNLINES: '/network/downlines',
  STATS: '/network/stats',
  INVITE: '/network/invite',
} as const

// Commission endpoints
export const COMMISSION_ENDPOINTS = {
  HISTORY: '/commission/history',
  EARNINGS: '/commission/earnings',
  PENDING: '/commission/pending',
  WITHDRAWALS: '/commission/withdrawals',
  STATS: '/commission/stats',
} as const

// Purchases endpoints
export const PURCHASES_ENDPOINTS = {
  HISTORY: '/purchases/history',
  OVERVIEW: '/purchases/overview',
  STATS: '/purchases/stats',
  CHARTS: '/purchases/charts',
} as const

// Payouts endpoints
export const PAYOUTS_ENDPOINTS = {
  HISTORY: '/payouts/history',
  REQUEST: '/payouts/request',
  PENDING: '/payouts/pending',
  STATS: '/payouts/stats',
} as const

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/user/profile',
  SETTINGS: '/user/settings',
  PREFERENCES: '/user/preferences',
  SECURITY: '/user/security',
} as const

// NFT endpoints
export const NFT_ENDPOINTS = {
  COLLECTION: '/nft/collection',
  DETAILS: '/nft/details',
  TRANSACTIONS: '/nft/transactions',
  MARKETPLACE: '/nft/marketplace',
} as const

// Utility function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_BASE_URL}${endpoint}`
  console.log(`Built API URL: ${fullUrl}`)
  return fullUrl
}

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const 