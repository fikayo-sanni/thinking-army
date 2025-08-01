# Gamescoin Frontend Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Authentication & Authorization](#authentication--authorization)
6. [Services & API Integration](#services--api-integration)
7. [Components](#components)
8. [Routing](#routing)
9. [State Management](#state-management)
10. [Styling & Theming](#styling--theming)
11. [Custom Hooks](#custom-hooks)
12. [Development Guidelines](#development-guidelines)
13. [Deployment](#deployment)
14. [Configuration](#configuration)
15. [Performance Optimization](#performance-optimization)
16. [Troubleshooting](#troubleshooting)

## Project Overview

The Gamescoin Frontend is a modern, responsive web application built with Next.js 14, TypeScript, and Tailwind CSS. It serves as the user interface for the Gamescoin ecosystem, providing features for dashboard analytics, commission tracking, network management, purchases, payouts, and user administration.

### Key Features

- **Dashboard Analytics**: Comprehensive overview of user performance and network statistics
- **Commission Tracking**: Real-time commission earnings and history
- **Network Management**: Multi-level network visualization and management
- **Purchase Management**: Star NFT purchase tracking and analytics
- **Payout System**: Payout requests and transaction history
- **User Authentication**: Secure OIDC-based authentication
- **Admin Panel**: Administrative functions and user management
- **Responsive Design**: Mobile-first responsive interface
- **Dark/Light Theme**: Complete theme switching capability
- **Real-time Updates**: Live data updates using React Query

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Authentication**: OIDC Client (oidc-client-ts)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Theme**: next-themes

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend App                         │
├─────────────────────────────────────────────────────────────┤
│  App Router (Next.js 14)                                   │
│  ├── Public Routes (/, /admin)                             │
│  ├── Protected Routes (/dashboard, /commissions, etc.)     │
│  └── Auth Gate + Route Guards                              │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                           │
│  ├── UI Components (shadcn/ui + Radix)                     │
│  ├── Business Components (Dashboard, Network, etc.)        │
│  ├── Layout Components (Sidebar, Header, etc.)             │
│  └── Form Components                                        │
├─────────────────────────────────────────────────────────────┤
│  Services & API Layer                                       │
│  ├── HTTP Client                                           │
│  ├── Service Modules (auth, dashboard, network, etc.)      │
│  ├── React Query Integration                               │
│  └── Error Handling                                        │
├─────────────────────────────────────────────────────────────┤
│  Authentication Layer                                       │
│  ├── OIDC Client Configuration                             │
│  ├── Auth Context & Hooks                                  │
│  └── Token Management                                      │
├─────────────────────────────────────────────────────────────┤
│  Backend Services                                           │
│  ├── Reports Service API                                   │
│  ├── Authentication Service                                │
│  └── Various Microservices                                 │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

1. **Component Composition**: Heavy use of component composition for reusability
2. **Service Layer**: Abstracted API calls through dedicated service modules
3. **Custom Hooks**: Business logic encapsulated in custom hooks
4. **Provider Pattern**: Context providers for theme, auth, and page titles
5. **Render Props**: Used in some complex components for flexibility
6. **Compound Components**: UI components following compound component pattern

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Access to backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=https://reports.backend.gamescoin.com/
   NEXT_PUBLIC_AUTHORITY_URL=your-oidc-authority-url
   NEXT_PUBLIC_CLIENT_ID=your-client-id
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:5005
   NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=http://localhost:5005
   NEXT_PUBLIC_RESPONSE_TYPE=code
   NEXT_PUBLIC_SCOPE=openid profile email
   NEXT_PUBLIC_LOAD_USER_INFO=true
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Access the Application**
   Open [http://localhost:5005](http://localhost:5005) in your browser

### Available Scripts

```bash
npm run dev      # Start development server on port 5005
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
frontend/
├── app/                              # Next.js App Router
│   ├── admin/                        # Admin pages
│   ├── commission/                   # Commission pages
│   ├── commissions/                  # Commissions listing
│   ├── dashboard/                    # Dashboard pages
│   ├── network/                      # Network pages
│   ├── payouts/                      # Payout pages
│   ├── preferences/                  # User preferences
│   ├── profile-settings/             # Profile settings
│   ├── purchases/                    # Purchase pages
│   ├── ranks/                        # Rank pages
│   ├── wallet-settings/              # Wallet settings
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout with providers
│   ├── layout.server.tsx             # Server layout
│   ├── loading.tsx                   # Loading component
│   ├── page.tsx                      # Homepage
│   └── page.server.tsx               # Server page component
├── components/                       # React components
│   ├── auth/                         # Authentication components
│   ├── commissions/                  # Commission-related components
│   ├── dashboard/                    # Dashboard components
│   ├── layout/                       # Layout components
│   ├── network/                      # Network components
│   ├── payouts/                      # Payout components
│   ├── providers/                    # Context providers
│   ├── purchases/                    # Purchase components
│   ├── ranks/                        # Rank components
│   ├── theme/                        # Theme components
│   └── ui/                           # Reusable UI components
├── hooks/                            # Custom React hooks
│   ├── use-auth.ts                   # Authentication hook
│   ├── use-commission.ts             # Commission data hook
│   ├── use-dashboard.ts              # Dashboard data hook
│   ├── use-network.ts                # Network data hook
│   ├── use-payouts.ts                # Payouts data hook
│   ├── use-purchases.ts              # Purchases data hook
│   └── use-ranks.ts                  # Ranks data hook
├── lib/                              # Utilities and configurations
│   ├── auth/                         # Authentication utilities
│   ├── config/                       # Configuration files
│   ├── providers/                    # Provider components
│   ├── services/                     # API service modules
│   ├── utils/                        # Utility functions
│   ├── api-constants.ts              # API endpoint definitions
│   ├── mock-data.ts                  # Mock data for development
│   └── utils.ts                      # General utilities
├── public/                           # Static assets
├── styles/                           # Additional stylesheets
├── .env.local                        # Environment variables
├── components.json                   # shadcn/ui configuration
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies and scripts
├── tailwind.config.js                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript configuration
```

### Key Directories Explained

- **`app/`**: Contains all pages using Next.js App Router
- **`components/`**: Organized by feature with `ui/` for reusable components
- **`hooks/`**: Custom React hooks for data fetching and state management
- **`lib/services/`**: API service modules with type definitions
- **`lib/auth/`**: Authentication configuration and utilities

## Authentication & Authorization

### OIDC Integration

The application uses OpenID Connect (OIDC) for authentication:

```typescript
// lib/auth/oidc.ts
export const oidcUserManager = new UserManager({
  authority: process.env.NEXT_PUBLIC_AUTHORITY_URL!,
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email',
  loadUserInfo: true,
  useRefreshToken: true,
  automaticSilentRenew: true,
});
```

### Auth Provider

```typescript
// lib/auth/AuthProvider.tsx
export function AuthProvider({ children }) {
  // Manages authentication state
  // Handles token refresh
  // Provides auth context
}
```

### Auth Hook

```typescript
// hooks/use-auth.ts
export function useAuth() {
  return {
    user,
    isAuthenticated: () => boolean,
    login: () => Promise<void>,
    logout: () => Promise<void>,
    processingCallback: boolean
  }
}
```

### Route Protection

The app implements route protection through an `AuthGate` component:

```typescript
// app/layout.tsx
function AuthGate({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Public routes: /, /admin
  // Protected routes: /dashboard, /commissions, etc.
  // Admin routes: /admin/*
}
```

### Access Control

- **Public Routes**: Landing page and admin login
- **Protected Routes**: All user dashboard features
- **Admin Routes**: Administrative functions with separate authentication

## Services & API Integration

### Service Architecture

All API interactions are centralized in service modules:

```typescript
// lib/services/dashboard-service.ts
export const dashboardService = {
  async getOverview(timeRange?: string): Promise<DashboardOverview> {
    // API call implementation
  },
  
  async getStats(timeRange?: string): Promise<DashboardStats> {
    // API call implementation
  }
}
```

### Available Services

1. **Auth Service** (`auth-service.ts`)
   - User authentication
   - Profile management
   - Token handling

2. **Dashboard Service** (`dashboard-service.ts`)
   - Overview data
   - Statistics
   - Charts data
   - Recent activity

3. **Commission Service** (`commission-service.ts`)
   - Commission history
   - Earnings tracking
   - Withdrawal management
   - Commission statistics

4. **Network Service** (`network-service.ts`)
   - Network structure
   - Downline management
   - Sponsor information
   - Network statistics

5. **Purchases Service** (`purchases-service.ts`)
   - Purchase history
   - Purchase statistics
   - Transaction tracking

6. **Payouts Service** (`payouts-service.ts`)
   - Payout history
   - Payout requests
   - Payout statistics

### API Constants

```typescript
// lib/api-constants.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
export const DASHBOARD_ENDPOINTS = {
  OVERVIEW: 'api/v1/dashboard/overview',
  STATS: 'api/v1/dashboard/stats',
  // ... more endpoints
}
```

### Error Handling

All services implement consistent error handling:

```typescript
async function apiRequest<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(buildApiUrl(url), {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}
```

## Components

### UI Components (`components/ui/`)

The application uses a comprehensive set of UI components based on Radix UI and styled with Tailwind CSS:

#### Core Components

- **`button.tsx`**: Button variants (default, destructive, outline, ghost, link)
- **`card.tsx`**: Card container with header, content, and footer
- **`input.tsx`**: Form input with validation styles
- **`select.tsx`**: Dropdown select component
- **`dialog.tsx`**: Modal dialog implementation
- **`sheet.tsx`**: Slide-out panel component
- **`table.tsx`**: Data table with sorting and pagination
- **`form.tsx`**: Form components with validation

#### Specialized Components

- **`chart.tsx`**: Recharts integration with theme support
- **`metric-card.tsx`**: Dashboard metric display
- **`modern-card.tsx`**: Styled card variant
- **`sidebar.tsx`**: Application sidebar
- **`data-table-card.tsx`**: Table wrapper with card styling

### Business Components

#### Dashboard Components (`components/dashboard/`)

```typescript
// components/dashboard/metric-card.tsx
interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  // Implementation
}
```

#### Commission Components (`components/commissions/`)

- **Commission History Tables**
- **Earnings Charts**
- **Withdrawal Forms**

#### Network Components (`components/network/`)

- **Network Visualization**
- **Downline Tables**
- **Sponsor Information**

### Layout Components (`components/layout/`)

```typescript
// components/layout/modern-sidebar.tsx
export function ModernSidebar({ children }: { children: React.ReactNode }) {
  // Responsive sidebar with navigation
}

// components/layout/modern-header.tsx
export function ModernHeader() {
  // Application header with user menu and theme toggle
}
```

### Component Guidelines

1. **Composition over Inheritance**: Use component composition
2. **TypeScript Props**: All components have typed props
3. **Responsive Design**: Mobile-first responsive components
4. **Accessibility**: ARIA labels and keyboard navigation
5. **Theme Support**: All components support dark/light themes

## Routing

### App Router Structure

The application uses Next.js 14 App Router with the following structure:

```
app/
├── page.tsx                    # Home page (/)
├── layout.tsx                  # Root layout
├── admin/
│   └── page.tsx               # Admin login (/admin)
├── dashboard/
│   ├── page.tsx               # Dashboard (/dashboard)
│   └── page.server.tsx        # Server component
├── commissions/
│   ├── page.tsx               # Commissions list
│   └── page.server.tsx
├── network/
│   ├── page.tsx               # Network view
│   └── page.server.tsx
└── [other-routes]/
```

### Route Types

1. **Public Routes**: 
   - `/` - Landing page
   - `/admin` - Admin login

2. **Protected Routes** (require authentication):
   - `/dashboard` - User dashboard
   - `/commissions` - Commission tracking
   - `/network` - Network management
   - `/purchases` - Purchase history
   - `/payouts` - Payout management
   - `/ranks` - Rank information
   - `/profile-settings` - User profile
   - `/wallet-settings` - Wallet configuration
   - `/preferences` - User preferences

### Navigation

```typescript
// components/layout/modern-sidebar.tsx
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Network', href: '/network', icon: Network },
  { name: 'Commissions', href: '/commissions', icon: DollarSign },
  { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
  { name: 'Payouts', href: '/payouts', icon: CreditCard },
  { name: 'Ranks', href: '/ranks', icon: Award },
]
```

## State Management

### React Query Integration

The application uses TanStack Query (React Query) for server state management:

```typescript
// hooks/use-dashboard.ts
export function useDashboard(timeRange: string = 'last-month') {
  return useQuery({
    queryKey: ['dashboard', timeRange],
    queryFn: () => dashboardService.getAllDashboardData(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  })
}
```

### Custom Hooks

Each feature area has dedicated hooks:

1. **`useDashboard`**: Dashboard data and statistics
2. **`useCommissions`**: Commission data and operations
3. **`useNetwork`**: Network structure and downlines
4. **`usePurchases`**: Purchase history and statistics
5. **`usePayouts`**: Payout data and requests
6. **`useRanks`**: Rank information and progress

### Global State

- **Authentication**: Managed by Auth Context
- **Theme**: Managed by next-themes
- **Page Titles**: Managed by PageTitleProvider

## Styling & Theming

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS variables for theme switching
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      }
    }
  }
}
```

### CSS Variables

```css
/* app/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  /* ... more variables */
}
```

### Theme Provider

```typescript
// components/theme/theme-provider.tsx
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Design System

- **Colors**: Primary brand colors with semantic variants
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 8px grid system
- **Shadows**: Consistent elevation system
- **Border Radius**: Consistent rounding (lg, md, sm)
- **Breakpoints**: Mobile-first responsive breakpoints

## Custom Hooks

### Data Fetching Hooks

#### `useDashboard`

```typescript
export function useDashboard(timeRange: string = 'last-month') {
  const queryResult = useQuery({
    queryKey: ['dashboard', timeRange],
    queryFn: () => dashboardService.getAllDashboardData(timeRange),
    staleTime: 5 * 60 * 1000,
  })

  return {
    ...queryResult,
    overview: queryResult.data?.overview,
    stats: queryResult.data?.stats,
    charts: queryResult.data?.charts,
    recentActivity: queryResult.data?.recentActivity,
  }
}
```

#### `useCommissions`

```typescript
export function useCommissions() {
  // Commission history query
  const useHistory = (page: number, limit: number, filters: CommissionFilters) => 
    useQuery({
      queryKey: ['commissions', 'history', page, limit, filters],
      queryFn: () => commissionService.getHistory(page, limit, filters),
    })

  // Commission earnings query
  const useEarnings = (timeRange?: string) =>
    useQuery({
      queryKey: ['commissions', 'earnings', timeRange],
      queryFn: () => commissionService.getEarnings(timeRange),
    })

  return { useHistory, useEarnings, /* ... more hooks */ }
}
```

### Utility Hooks

#### `useAuth`

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [processingCallback, setProcessingCallback] = useState(false)

  const isAuthenticated = useCallback(() => {
    // Check authentication status
  }, [])

  const login = useCallback(async () => {
    // Initiate login flow
  }, [])

  const logout = useCallback(async () => {
    // Handle logout
  }, [])

  return { user, isAuthenticated, login, logout, processingCallback }
}
```

## Development Guidelines

### Code Style

1. **TypeScript**: Strict type checking enabled
2. **ESLint**: Standard Next.js ESLint configuration
3. **Prettier**: Consistent code formatting
4. **File Naming**: kebab-case for files, PascalCase for components

### Component Development

```typescript
// Example component structure
interface ComponentProps {
  // Always define props interface
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks at the top
  const [state, setState] = useState()
  const { data } = useQuery()

  // 2. Event handlers
  const handleClick = useCallback(() => {
    // Implementation
  }, [dependencies])

  // 3. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies])

  // 4. Conditional returns
  if (loading) return <Skeleton />

  // 5. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### API Integration Guidelines

1. **Service Layer**: All API calls through service modules
2. **Error Handling**: Consistent error handling across services
3. **Type Safety**: Full TypeScript coverage for API responses
4. **Caching**: Appropriate cache strategies with React Query

### Testing Strategy

```typescript
// Component testing example
import { render, screen } from '@testing-library/react'
import { Component } from './component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })
})
```

### Performance Guidelines

1. **Code Splitting**: Dynamic imports for large components
2. **Image Optimization**: Next.js Image component
3. **Bundle Analysis**: Regular bundle size monitoring
4. **Memoization**: React.memo, useMemo, useCallback where appropriate

## Deployment

### Build Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',              // Static export
  images: { unoptimized: true }, // For static hosting
  trailingSlash: true,           // Consistent URLs
  typescript: {
    ignoreBuildErrors: true,     // Build even with TS errors
  },
  eslint: {
    ignoreDuringBuilds: true,    // Build even with lint errors
  },
}
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Required environment variables for deployment:

```bash
NEXT_PUBLIC_API_URL=https://your-api-url.com/
NEXT_PUBLIC_AUTHORITY_URL=https://your-oidc-provider.com
NEXT_PUBLIC_CLIENT_ID=your-client-id
NEXT_PUBLIC_REDIRECT_URI=https://your-domain.com
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=https://your-domain.com
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints accessible
- [ ] OIDC provider configured
- [ ] Build process successful
- [ ] Static assets optimized
- [ ] Error monitoring configured
- [ ] Performance monitoring enabled

## Configuration

### Next.js Configuration

```javascript
// next.config.js - Key configurations
{
  output: 'export',              // Static site generation
  images: { unoptimized: true }, // Required for static export
  trailingSlash: true,           // Consistent URL format
  pageExtensions: ["ts", "tsx"], // Supported file extensions
}
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

### shadcn/ui Configuration

```json
// components.json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## Performance Optimization

### React Query Optimization

```typescript
// Optimized query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      cacheTime: 10 * 60 * 1000,   // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

### Bundle Optimization

1. **Dynamic Imports**: Large components loaded on demand
2. **Tree Shaking**: Unused code eliminated
3. **Code Splitting**: Automatic route-based splitting
4. **Asset Optimization**: Images and fonts optimized

### Rendering Optimization

```typescript
// Memoization examples
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => 
    expensiveCalculation(data), [data]
  )
  
  return <div>{processedData}</div>
})
```

### Loading States

```typescript
// Consistent loading patterns
export function DataComponent() {
  const { data, isLoading, error } = useQuery()

  if (isLoading) return <Skeleton />
  if (error) return <ErrorBoundary />
  
  return <DataDisplay data={data} />
}
```

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check OIDC configuration
   - Verify redirect URIs
   - Check token expiration

2. **API Connection Issues**
   - Verify API_BASE_URL
   - Check CORS configuration
   - Verify authentication headers

3. **Build Issues**
   - Clear `.next` directory
   - Update dependencies
   - Check TypeScript errors

4. **Styling Issues**
   - Verify Tailwind configuration
   - Check CSS variable definitions
   - Ensure theme provider is configured

### Debug Mode

Enable debug logging:

```typescript
// Enable React Query devtools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
```

### Performance Debugging

```typescript
// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  console.log('Render time:', performance.now())
}
```

### Error Boundaries

```typescript
// Global error boundary
export function ErrorBoundary({ children }) {
  // Error handling implementation
}
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Radix UI Documentation](https://radix-ui.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

This documentation covers the comprehensive architecture and implementation details of the Gamescoin Frontend application. For specific implementation questions or issues, refer to the relevant sections above or consult the linked external documentation. 