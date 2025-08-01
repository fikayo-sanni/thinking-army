# Component Development Guide

## Overview

This guide provides comprehensive patterns and best practices for developing components in the Gamescoin Frontend application.

## Component Architecture

### Component Hierarchy

```
components/
├── ui/                    # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── layout/               # Layout-specific components
│   ├── modern-sidebar.tsx
│   ├── modern-header.tsx
│   └── navigation.tsx
├── features/            # Feature-specific components
│   ├── dashboard/
│   ├── commissions/
│   ├── network/
│   └── ...
└── common/              # Shared business components
    ├── data-table.tsx
    ├── charts/
    └── forms/
```

## Base UI Components

### Button Component

```typescript
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Card Component

```typescript
// components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

## Business Components

### Metric Card Component

```typescript
// components/dashboard/metric-card.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  className?: string
  loading?: boolean
  error?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  className,
  loading = false,
  error
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="h-7 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-20" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("border-destructive", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="h-4 w-4" />
    return change > 0 
      ? <TrendingUp className="h-4 w-4" />
      : <TrendingDown className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (change === undefined || change === 0) return "text-muted-foreground"
    return change > 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={cn("text-xs flex items-center gap-1 mt-1", getTrendColor())}>
            {getTrendIcon()}
            <span>
              {Math.abs(change)}% {changeLabel || "from last month"}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

### Data Table Component

```typescript
// components/ui/data-table.tsx
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface Column<T> {
  key: keyof T | string
  header: string
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: string
  pagination?: {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error,
  pagination,
  onSort,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const handleSort = (column: keyof T) => {
    if (!onSort) return

    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newDirection)
    onSort(column, newDirection)
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} style={{ width: column.width }}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive p-4">
        <div className="text-destructive text-sm">{error}</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} style={{ width: column.width }}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead 
                  key={index} 
                  style={{ width: column.width }}
                  className={column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => column.sortable && handleSort(column.key as keyof T)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.cell 
                      ? column.cell(item)
                      : String(item[column.key] || '')
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Form Components

### Form Hook Pattern

```typescript
// components/forms/commission-withdrawal-form.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCommissionWithdrawal } from '@/hooks/use-commission'

const withdrawalSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Please select a currency'),
})

type WithdrawalFormData = z.infer<typeof withdrawalSchema>

interface CommissionWithdrawalFormProps {
  availableBalances: Record<string, number>
  onSuccess?: () => void
  onCancel?: () => void
}

export function CommissionWithdrawalForm({
  availableBalances,
  onSuccess,
  onCancel,
}: CommissionWithdrawalFormProps) {
  const withdrawalMutation = useCommissionWithdrawal()

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      currency: '',
    },
  })

  const selectedCurrency = form.watch('currency')
  const maxAmount = selectedCurrency ? availableBalances[selectedCurrency] || 0 : 0

  const onSubmit = async (data: WithdrawalFormData) => {
    try {
      await withdrawalMutation.mutateAsync(data)
      onSuccess?.(  )
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(availableBalances).map(([currency, balance]) => (
                    <SelectItem key={currency} value={currency}>
                      {currency} (Available: {balance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the currency for your withdrawal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Maximum available: {maxAmount} {selectedCurrency}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={withdrawalMutation.isLoading}
          >
            {withdrawalMutation.isLoading ? 'Processing...' : 'Submit Withdrawal'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## Chart Components

### Recharts Integration

```typescript
// components/charts/commission-chart.tsx
import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface ChartDataPoint {
  date: string
  c1Commission: number
  c2Commission: number
  c3Commission: number
}

export interface CommissionChartProps {
  data: ChartDataPoint[]
  loading?: boolean
  error?: string
  title?: string
  description?: string
}

export function CommissionChart({
  data,
  loading = false,
  error,
  title = "Commission Earnings",
  description = "Your commission earnings over time"
}: CommissionChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-destructive text-sm">{error}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="c1Commission"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="C1 Commission"
            />
            <Line
              type="monotone"
              dataKey="c2Commission"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              name="C2 Commission"
            />
            <Line
              type="monotone"
              dataKey="c3Commission"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              name="C3 Commission"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

## Component Patterns

### Compound Components

```typescript
// components/ui/data-display.tsx
interface DataDisplayContextValue {
  data: any[]
  loading: boolean
  error: string | null
}

const DataDisplayContext = React.createContext<DataDisplayContextValue | null>(null)

export function DataDisplay({ children, data, loading, error }: DataDisplayProps) {
  return (
    <DataDisplayContext.Provider value={{ data, loading, error }}>
      <div className="space-y-4">
        {children}
      </div>
    </DataDisplayContext.Provider>
  )
}

DataDisplay.Header = function DataDisplayHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b pb-4">{children}</div>
}

DataDisplay.Content = function DataDisplayContent({ children }: { children: React.ReactNode }) {
  const context = React.useContext(DataDisplayContext)
  if (!context) throw new Error('DataDisplayContent must be used within DataDisplay')

  if (context.loading) return <div>Loading...</div>
  if (context.error) return <div>Error: {context.error}</div>
  if (context.data.length === 0) return <div>No data</div>

  return <div>{children}</div>
}

DataDisplay.Footer = function DataDisplayFooter({ children }: { children: React.ReactNode }) {
  return <div className="border-t pt-4">{children}</div>
}

// Usage:
// <DataDisplay data={data} loading={loading} error={error}>
//   <DataDisplay.Header>Title</DataDisplay.Header>
//   <DataDisplay.Content>Content</DataDisplay.Content>
//   <DataDisplay.Footer>Footer</DataDisplay.Footer>
// </DataDisplay>
```

### Render Props

```typescript
// components/data-fetcher.tsx
interface DataFetcherProps<T> {
  queryKey: string[]
  queryFn: () => Promise<T>
  children: (result: {
    data: T | undefined
    loading: boolean
    error: Error | null
    refetch: () => void
  }) => React.ReactNode
}

export function DataFetcher<T>({ queryKey, queryFn, children }: DataFetcherProps<T>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
  })

  return children({
    data,
    loading: isLoading,
    error,
    refetch,
  })
}

// Usage:
// <DataFetcher queryKey={['users']} queryFn={fetchUsers}>
//   {({ data, loading, error }) => (
//     <div>
//       {loading && <div>Loading...</div>}
//       {error && <div>Error: {error.message}</div>}
//       {data && <UserList users={data} />}
//     </div>
//   )}
// </DataFetcher>
```

## Performance Optimization

### React.memo Usage

```typescript
// components/expensive-component.tsx
interface ExpensiveComponentProps {
  data: LargeDataSet
  onUpdate: (id: string, value: any) => void
}

export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(
  ({ data, onUpdate }) => {
    // Expensive rendering logic
    return <div>{/* Complex UI */}</div>
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return (
      prevProps.data.id === nextProps.data.id &&
      prevProps.data.updatedAt === nextProps.data.updatedAt
    )
  }
)
```

### useMemo and useCallback

```typescript
// components/optimized-component.tsx
export function OptimizedComponent({ items, filters, onItemSelect }: Props) {
  // Expensive filtering operation
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      filters.every(filter => filter.predicate(item))
    )
  }, [items, filters])

  // Stable callback reference
  const handleItemSelect = useCallback((itemId: string) => {
    onItemSelect(itemId)
  }, [onItemSelect])

  // Expensive calculation
  const statistics = useMemo(() => {
    return calculateStatistics(filteredItems)
  }, [filteredItems])

  return (
    <div>
      <StatisticsDisplay stats={statistics} />
      <ItemList items={filteredItems} onSelect={handleItemSelect} />
    </div>
  )
}
```

## Testing Components

### Component Testing

```typescript
// components/__tests__/metric-card.test.tsx
import { render, screen } from '@testing-library/react'
import { MetricCard } from '../metric-card'

describe('MetricCard', () => {
  it('renders title and value correctly', () => {
    render(
      <MetricCard 
        title="Total Earnings" 
        value="$1,234.56" 
      />
    )
    
    expect(screen.getByText('Total Earnings')).toBeInTheDocument()
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <MetricCard 
        title="Total Earnings" 
        value="$1,234.56" 
        loading={true}
      />
    )
    
    expect(screen.getByTitle('Total Earnings')).toBeInTheDocument()
    expect(screen.queryByText('$1,234.56')).not.toBeInTheDocument()
  })

  it('shows error state', () => {
    render(
      <MetricCard 
        title="Total Earnings" 
        value="$1,234.56" 
        error="Failed to load"
      />
    )
    
    expect(screen.getByText('Failed to load')).toBeInTheDocument()
  })

  it('displays change indicator correctly', () => {
    render(
      <MetricCard 
        title="Total Earnings" 
        value="$1,234.56" 
        change={15.5}
        changeLabel="from last week"
      />
    )
    
    expect(screen.getByText('15.5% from last week')).toBeInTheDocument()
  })
})
```

### Storybook Integration

```typescript
// components/metric-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MetricCard } from './metric-card'
import { DollarSign } from 'lucide-react'

const meta: Meta<typeof MetricCard> = {
  title: 'Components/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Total Earnings',
    value: '$1,234.56',
  },
}

export const WithIcon: Story = {
  args: {
    title: 'Total Earnings',
    value: '$1,234.56',
    icon: <DollarSign />,
  },
}

export const WithPositiveChange: Story = {
  args: {
    title: 'Total Earnings',
    value: '$1,234.56',
    change: 15.5,
    changeLabel: 'from last month',
    icon: <DollarSign />,
  },
}

export const WithNegativeChange: Story = {
  args: {
    title: 'Total Earnings',
    value: '$1,234.56',
    change: -8.2,
    changeLabel: 'from last month',
    icon: <DollarSign />,
  },
}

export const Loading: Story = {
  args: {
    title: 'Total Earnings',
    value: '$1,234.56',
    loading: true,
  },
}

export const Error: Story = {
  args: {
    title: 'Total Earnings',
    value: '$1,234.56',
    error: 'Failed to load earnings data',
  },
}
```

## Best Practices

### 1. Component Composition

```typescript
// Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
  </CardHeader>
  <CardContent>
    <MetricCard title="Earnings" value="$1,234" />
  </CardContent>
</Card>

// Avoid: Monolithic components
<DashboardCard 
  title="Dashboard" 
  earnings="$1,234" 
  showHeader={true}
  showMetrics={true}
/>
```

### 2. Props Interface Design

```typescript
// Good: Well-defined props with defaults
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

// Avoid: Unclear or too generic props
interface ButtonProps {
  [key: string]: any
}
```

### 3. Error Boundaries

```typescript
// Wrap components that might fail
<ErrorBoundary fallback={<ErrorFallback />}>
  <DataDependentComponent />
</ErrorBoundary>
```

### 4. Accessibility

```typescript
// Good: Accessible component
<button
  type="button"
  aria-label="Close dialog"
  aria-describedby="dialog-description"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</button>

// Include ARIA labels and keyboard navigation
```

### 5. Theme Integration

```typescript
// Use CSS variables for theming
const buttonVariants = cva(
  "bg-primary text-primary-foreground hover:bg-primary/90",
  // variants...
)

// Support dark/light modes
<div className="bg-background text-foreground">
  {/* Content */}
</div>
```

This comprehensive component development guide provides patterns and best practices for building maintainable, performant, and accessible components in the Gamescoin Frontend application. 