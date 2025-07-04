// API Base URL - Update this based on your backend environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
  OVERVIEW: '/api/v1/dashboard/overview',
  STATS: '/api/v1/dashboard/stats',
  CHARTS: '/api/v1/dashboard/charts',
  RECENT_ACTIVITY: '/api/v1/dashboard/recent-activity',
  ALL: '/api/v1/dashboard/all',
} as const

// Network endpoints
export const NETWORK_ENDPOINTS = {
  STRUCTURE: '/api/v1/network/structure',
  SPONSOR: '/api/v1/network/sponsor',
  DOWNLINES: '/api/v1/network/downlines',
  STATS: '/api/v1/network/stats',
  INVITE: '/api/v1/network/invite',
} as const

// Commission endpoints
export const COMMISSION_ENDPOINTS = {
  HISTORY: '/api/v1/commission/history',
  EARNINGS: '/api/v1/commission/earnings',
  PENDING: '/api/v1/commission/pending',
  WITHDRAWALS: '/api/v1/commission/withdrawals',
  STATS: '/api/v1/commission/stats',
  CHARTS: '/api/v1/commission/chart-data',
} as const

// Purchases endpoints
export const PURCHASES_ENDPOINTS = {
  HISTORY: '/api/v1/purchases/history',
  OVERVIEW: '/api/v1/purchases/overview',
  STATS: '/api/v1/purchases/stats',
  CHARTS: '/api/v1/purchases/charts',
  ALL: '/api/v1/purchases/all',
} as const

// Payouts endpoints
export const PAYOUTS_ENDPOINTS = {
  HISTORY: '/api/v1/payouts/history',
  REQUEST: '/api/v1/payouts/request',
  PENDING: '/api/v1/payouts/pending',
  STATS: '/api/v1/payouts/stats',
} as const

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/api/v1/user/profile',
  SETTINGS: '/api/v1/user/settings',
  PREFERENCES: '/api/v1/user/preferences',
  SECURITY: '/api/v1/user/security',
} as const

// NFT endpoints
export const NFT_ENDPOINTS = {
  COLLECTION: '/api/v1/nft/collection',
  DETAILS: '/api/v1/nft/details',
  TRANSACTIONS: '/api/v1/nft/transactions',
  MARKETPLACE: '/api/v1/nft/marketplace',
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