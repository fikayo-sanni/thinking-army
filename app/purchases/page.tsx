"use client"

import { useState } from "react"
import { useTheme } from "@/components/theme/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Filter, AlertTriangle, BarChart3, Calendar } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { usePurchaseOverview, usePurchaseChartData, usePurchaseHistory } from "@/hooks"
import { useTimeRange } from "@/hooks/use-time-range"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PurchasesSummaryCardsSkeleton,
  PurchasesChartSkeleton,
  PurchasesTableSkeleton
} from "@/components/purchases/purchases-skeletons"
import { formatThousands, formatShortNumber, groupChartData, formatXAxisLabel } from "@/lib/utils"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MobileTable } from "@/components/ui/mobile-table"
import { useSetPageTitle } from "@/hooks/use-page-title"

// Add type definitions
interface Overview {
  totalSpent: number;
  totalPurchases: number;
  currency?: string;
}

interface Purchase {
  id: string;
  date: string;
  tokenId: string;
  category: string;
  amount: number;
  currency: string;
  source: string;
  level: number;
}

const categoryNames: Record<string, string> = {
  '1': 'Star',
  '2': 'SuperStar',
  '3': 'GensisStar',
  '20': 'SupraStar',
  '90': 'PowerStar',
  '91': 'PowerStar',
  '92': 'PowerStar',
  '93': 'PowerStar',
  '94': 'PowerStar',
};

const chartConfig = {
  purchases: {
    label: "Purchases",
    color: "#0846A6",
  },
  volume: {
    label: "Volume (USDC)",
    color: "#00B28C",
  },
}

// Add card styles
const cardStyles = {
  base: "bg-white dark:bg-[#1E1E1E] border border-[#E4E6EB] dark:border-[#2A2A2A] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:border-[#DADCE0] dark:hover:border-[#3A3A3A] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
  header: "flex items-center justify-between p-4 border-b border-[#E4E6EB] dark:border-[#2A2A2A]",
  headerLeft: "flex items-center space-x-3",
  iconContainer: "flex items-center justify-center w-8 h-8 rounded-lg bg-[#297EFF]/10 dark:bg-[#4D8DFF]/10",
  icon: "w-5 h-5 text-[#297EFF] dark:text-[#4D8DFF]",
  title: "text-[15px] font-medium text-[#202124] dark:text-[#E6E6E6]",
  subtitle: "text-[12px] text-[#5F6368] dark:text-[#A0A0A0] mt-0.5",
  content: "p-4",
  metric: {
    container: "flex items-center justify-between p-3 rounded-md bg-[#F8F9FB] dark:bg-[#1A2B45] transition-colors duration-150",
    label: "text-[14px] text-[#5F6368] dark:text-[#A0A0A0]",
    value: "text-[20px] font-semibold text-[#202124] dark:text-[#E6E6E6]",
    change: {
      positive: "text-[12px] font-medium text-emerald-500 dark:text-emerald-400",
      negative: "text-[12px] font-medium text-red-500 dark:text-red-400",
      neutral: "text-[12px] font-medium text-[#5F6368] dark:text-[#A0A0A0]",
    },
  },
  chart: {
    container: "mt-4",
    title: "text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6] mb-4",
    wrapper: "w-full h-[300px]",
  },
};

export default function PurchasesPage() {
  // Set page title
  useSetPageTitle("Network Activity");

  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useTimeRange("this-week")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🚀 OPTIMIZED: Use individual hooks for parallel loading
  // Add type assertion for the overview data
  const { data: overview, isLoading: isOverviewLoading, error: overviewError, refetch: refetchOverview } = usePurchaseOverview(timeRange) as { 
    data: Overview | undefined, 
    isLoading: boolean, 
    error: any, 
    refetch: () => void 
  };
  const { data: chartData, isLoading: isChartLoading, error: chartError, refetch: refetchChart } = usePurchaseChartData(timeRange)
  const { data: historyData, isLoading: isHistoryLoading, error: historyError, refetch: refetchHistory } = usePurchaseHistory(
    { timeRange, status: statusFilter !== "all" ? statusFilter : undefined },
    currentPage,
    itemsPerPage
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">COMPLETED</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">PENDING</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">FAILED</Badge>
      default:
        return <Badge className="bg-[#2C2F3C] text-[#A0AFC0]">{status.toUpperCase()}</Badge>
    }
  }

  // Check if any critical data failed to load
  const hasCriticalError = overviewError || historyError;
  
  if (hasCriticalError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Network Activity Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your network activity right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchOverview(); refetchChart(); refetchHistory(); }} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const purchases = historyData?.purchases || []
  const totalPages = historyData?.totalPages || 1;

  console.log(chartData)

  // Determine groupBy for chart
  let groupBy: 'day' | 'week' | 'month' = 'day';
  if (["all-time", "this-month", "last-month", "this-quarter", "last-quarter"].includes(timeRange)) {
    groupBy = 'month';
  }
  if (["this-week", "last-week"].includes(timeRange)) {
    groupBy = 'day';
  }
  if (["this-quarter", "last-quarter"].includes(timeRange)) {
    groupBy = 'week';
  }
  const groupedChartData = groupChartData(chartData || [], groupBy);

  // Safe format functions
  const safeFormatThousands = (value: number | string | undefined): string => {
    if (typeof value === 'undefined') return '0';
    return formatThousands(String(value));
  };

  const safeFormatCurrency = (value: number | undefined, currency: string | undefined): string => {
    return `${safeFormatThousands(value)} ${currency || 'VP'}`;
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-semibold text-[#202124] dark:text-[#E6E6E6]">
            Network Activity
          </h1>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-9 bg-white dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] w-48">
                <Calendar className="mr-2 h-4 w-4 text-[#5F6368] dark:text-[#A0A0A0]" />
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content with Right Panel */}
      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Summary Stats */}
          {isOverviewLoading ? (
            <PurchasesSummaryCardsSkeleton />
          ) : overview ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <div className="h-5 w-5 rounded bg-[#297EFF]" />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Volume Points</h3>
                      <p className={cardStyles.subtitle}>Total in period</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {safeFormatCurrency(overview.totalSpent, overview.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <div className="h-5 w-5 rounded bg-[#00B28C]" />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Total Purchases</h3>
                      <p className={cardStyles.subtitle}>Count in period</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {safeFormatThousands(overview.totalPurchases)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[#5F6368] dark:text-[#A0A0A0] text-center py-8">No purchase overview available.</div>
          )}

          {/* Network Purchases Over Time Chart */}
          {isChartLoading ? (
            <PurchasesChartSkeleton />
          ) : (chartData && chartData.length > 0) ? (
            <div className={cardStyles.base}>
              <div className={cardStyles.header}>
                <div className={cardStyles.headerLeft}>
                  <div className={cardStyles.iconContainer}>
                    <BarChart3 className={cardStyles.icon} />
                  </div>
                  <div>
                    <h3 className={cardStyles.title}>Network Transactions</h3>
                    <p className={cardStyles.subtitle}>Daily purchase activity and volume trends</p>
                  </div>
                </div>
              </div>
              <div className={cardStyles.content}>
                <ChartContainer config={chartConfig}>
                  <LineChart data={groupedChartData} width={600} height={300}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2C2F3C" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                      tick={{ fill: theme === "dark" ? "#A0A0A0" : "#5F6368", fontSize: 12 }}
                      tickFormatter={date => formatXAxisLabel(date, groupBy)}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                      tick={{ fill: theme === "dark" ? "#A0A0A0" : "#5F6368", fontSize: 12 }}
                      tickFormatter={formatShortNumber}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                      tick={{ fill: theme === "dark" ? "#A0A0A0" : "#5F6368", fontSize: 12 }}
                      tickFormatter={formatShortNumber}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E4E6EB] dark:border-[#2A2A2A] rounded-lg p-3 shadow-lg">
                              <div className="text-[#202124] dark:text-[#E6E6E6] font-medium mb-2">{label}</div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#297EFF]">Purchases:</span>
                                  <span className="text-[#202124] dark:text-[#E6E6E6] font-medium">{formatThousands(String(payload[0]?.value))}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#00B28C]">Volume:</span>
                                  <span className="text-[#202124] dark:text-[#E6E6E6] font-medium">{formatThousands(String(parseInt(String(payload[1]?.value))))} VP</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="purchases"
                      stroke="#297EFF"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, stroke: "#297EFF", strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="volume"
                      stroke="#00B28C"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, stroke: "#00B28C", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          ) : chartError ? (
            <div className="text-red-500 text-center py-8">Failed to load chart data.</div>
          ) : null}

          {/* Purchases Table */}
          {isHistoryLoading ? (
            <PurchasesTableSkeleton />
          ) : (
            <div className={cardStyles.base}>
              <div className={cardStyles.header}>
                <div className={cardStyles.headerLeft}>
                  <div className={cardStyles.iconContainer}>
                    <Filter className={cardStyles.icon} />
                  </div>
                  <div>
                    <h3 className={cardStyles.title}>Network Activity History</h3>
                    <p className={cardStyles.subtitle}>
                      Showing {Number(purchases.length)} of {formatThousands(Number(historyData?.total || 0))} transactions
                    </p>
                  </div>
                </div>
              </div>
              <div className={cardStyles.content}>
                <MobileTable
                  columns={[
                    {
                      key: 'date',
                      header: 'Date',
                      mobileLabel: 'Date',
                      render: (value) => new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    },
                    {
                      key: 'tokenId',
                      header: 'Item ID',
                      mobileLabel: 'Item',
                      render: (value, row) => (
                        <a
                          href={`https://polygonscan.com/nft/0x7681a8fba3b29533c7289dfab91dda24a48228ec/${value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#0846A6] hover:underline hover:text-[#00B28C] transition font-medium"
                        >
                          {categoryNames[row.category] || row.category} #{value}
                        </a>
                      )
                    },
                    {
                      key: 'amount',
                      header: 'Volume Points',
                      render: (value, row) => (
                        <span className="text-[#0846A6] font-bold">
                          {formatThousands(parseInt(String(value)))} {row.currency}
                        </span>
                      )
                    },
                    {
                      key: 'source',
                      header: 'Buyer',
                      mobileLabel: 'Buyer',
                      render: (value, row) => `${value} (Level:${row.level})`
                    }
                  ]}
                  data={purchases}
                  keyField="id"
                  emptyMessage={historyError ? "Failed to load purchase history." : "No purchases found"}
                />

                {/* Pagination */}
                {/* ... existing pagination ... */}
              </div>
            </div>
          )}
        </div>

        {/* Right Details Panel */}
        <div className="hidden xl:block w-[340px] bg-white dark:bg-[#1E1E1E] border-l border-[#E4E6EB] dark:border-[#2A2A2A]">
          <div className="sticky top-0 p-6 space-y-6">
            {/* Quick Stats Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Total Volume</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isOverviewLoading ? (
                      <Skeleton className="h-4 w-16 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      safeFormatCurrency(overview?.totalSpent, overview?.currency)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Total Purchases</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isOverviewLoading ? (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      safeFormatThousands(overview?.totalPurchases)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Feed Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {(purchases as Purchase[]).slice(0, 5).map((purchase) => (
                  <div key={purchase.id} className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-[#297EFF]/10">
                      <Filter className="h-4 w-4 text-[#297EFF]" />
                    </div>
                    <div>
                      <p className="text-[14px] text-[#202124] dark:text-[#E6E6E6]">
                        {purchase.source} purchased {categoryNames[purchase.category] || purchase.category} #{purchase.tokenId}
                      </p>
                      <span className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">
                        {new Date(purchase.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}