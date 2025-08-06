"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { DataTableCard } from "@/components/ui/data-table-card"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Filter, AlertTriangle } from "lucide-react"
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
import { MobileFilterControls } from "@/components/layout/mobile-filter-controls"
import { useSetPageTitle } from "@/hooks/use-page-title"

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

export default function PurchasesPage() {
  // Set page title
  useSetPageTitle("Network Activity");

  const [timeRange, setTimeRange] = useTimeRange("this-week")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🚀 OPTIMIZED: Use individual hooks for parallel loading
  const { data: overview, isLoading: isOverviewLoading, error: overviewError, refetch: refetchOverview } = usePurchaseOverview(timeRange)
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

  return (
    <div className="min-h-screen">
      <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Page Title Block */}
        <PageHeader title="NETWORK ACTIVITY" description="Tracking my network's activity" />

        {/* Summary Stats - Load independently */}
        {isOverviewLoading ? (
          <PurchasesSummaryCardsSkeleton />
        ) : overview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#0846A6]/10">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded bg-[#0846A6]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white mobile-text-lg">
                  {formatThousands(parseInt(overview.totalSpent.toFixed(2)) || '0.0')} {overview.currency || 'VP'}
                </div>
                <div className="text-[#A0AFC0] text-xs sm:text-sm uppercase tracking-wider mobile-text-sm">
                  TOTAL VOLUME POINTS IN PERIOD
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#00B28C]/10">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded bg-[#00B28C]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white mobile-text-lg">
                  {formatThousands(overview.totalPurchases) || 0}
                </div>
                <div className="text-[#A0AFC0] text-xs sm:text-sm uppercase tracking-wider mobile-text-sm">
                  TOTAL PURCHASES IN PERIOD
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-[#A0AFC0] text-center py-8">No purchase overview available.</div>
        )}

        {/* Filter Controls Block */}
        <MobileFilterControls title="Activity Filters">
          <div className="flex items-center space-x-2 md:space-x-2">
            <CalendarDays className="h-4 w-4 text-[#A0AFC0] hidden md:block" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-48 h-12 md:h-auto dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-none">
                <SelectItem value="all-time" className="text-white hover:bg-[#E5E7EB]">
                  All Time
                </SelectItem>
                <SelectItem value="this-week" className="text-white hover:bg-[#E5E7EB]">
                  This Week
                </SelectItem>
                <SelectItem value="this-month" className="text-white hover:bg-[#E5E7EB]">
                  This Month
                </SelectItem>
                <SelectItem value="this-quarter" className="text-white hover:bg-[#E5E7EB]">
                  This Quarter
                </SelectItem>
                <SelectItem value="last-week" className="text-white hover:bg-[#E5E7EB]">
                  Last Week
                </SelectItem>
                <SelectItem value="last-month" className="text-white hover:bg-[#E5E7EB]">
                  Last Month
                </SelectItem>
                <SelectItem value="last-quarter" className="text-white hover:bg-[#E5E7EB]">
                  Last Quarter
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </MobileFilterControls>

        {/* Network Purchases Over Time Chart - Load independently */}
        {isChartLoading ? (
          <PurchasesChartSkeleton />
        ) : (chartData && chartData.length > 0) ? (
          <ChartCard title="NETWORK TRANSACTIONS OVER TIME" description="Daily purchase activity and volume trends">
            <ChartContainer config={chartConfig}>
              <LineChart data={groupedChartData} width={600} height={300}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2F3C" />
                <XAxis
                  dataKey="date"
                  stroke="#A0AFC0"
                  tick={{ fontSize: 15 }}
                  tickFormatter={date => formatXAxisLabel(date, groupBy)}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#A0AFC0"
                  tick={{ fontSize: 15 }}
                  tickFormatter={formatShortNumber}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#A0AFC0"
                  tick={{ fontSize: 15 }}
                  tickFormatter={formatShortNumber}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="dark:bg-[#1A1E2D] bg-white border border-[#E5E7EB] rounded-lg p-3 shadow-lg">
                          <div className="dark:text-white text-black font-medium mb-2">{label}</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#0846A6]">Purchases:</span>
                              <span className="dark:text-white text-black font-medium">{formatThousands(String(payload[0]?.value))}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#00B28C]">Volume:</span>
                              <span className="dark:text-white text-black font-medium">{formatThousands(String(parseInt(String(payload[1]?.value))))} VP</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="purchases"
                  stroke="#0846A6"
                  strokeWidth={1.5}
                  dot={{ fill: "#0846A6", strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 4, stroke: "#0846A6", strokeWidth: 1 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="volume"
                  stroke="#00B28C"
                  strokeWidth={1.5}
                  dot={{ fill: "#00B28C", strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 4, stroke: "#00B28C", strokeWidth: 1 }}
                />
              </LineChart>
            </ChartContainer>
          </ChartCard>
        ) : chartError ? (
          <div className="text-red-500 text-center py-8">Failed to load chart data.</div>
        ) : null}

        {/* Purchases Table Block - Load independently */}
        {isHistoryLoading ? (
          <PurchasesTableSkeleton />
        ) : (
          <DataTableCard
            title="NETWORK ACTIVITY HISTORY"
            subtitle={`Showing ${Number(purchases.length)} of ${formatThousands(Number(historyData?.total || 0))} transactions`}
            showExport
            onExport={() => console.log("Export data")}
          >
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

            {/* Pagination - only show if not error and has data */}
            {!historyError && purchases.length > 0 && (
              <div className="mt-4 space-y-4">
                {/* Mobile Stats */}
                <div className="text-center md:hidden">
                  <div className="text-[#A0AFC0] text-sm">
                    Page {formatThousands(currentPage)} of {formatThousands(totalPages)}
                  </div>
                  <div className="text-[#A0AFC0] text-xs">
                    {formatThousands(historyData?.total || 0)} total results
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Desktop Stats */}
                  <div className="hidden md:block flex-1 text-[#A0AFC0] text-sm">
                    Page {formatThousands(currentPage)} of {formatThousands(totalPages)} ({formatThousands(historyData?.total || 0)} total results)
                  </div>

                  {/* Items per page - Full width on mobile */}
                  <div className="w-full md:w-auto">
                    <Select value={String(itemsPerPage)} onValueChange={v => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                      <SelectTrigger className="w-full md:w-32 h-12 md:h-auto dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-none">
                        {[5, 10, 20, 50].map(opt => (
                          <SelectItem key={opt} value={String(opt)} className="text-white hover:bg-[#E5E7EB]">{opt} / page</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pagination controls - Simplified for mobile */}
                  <div className="flex items-center space-x-2 w-full md:w-auto justify-center">
                    <button
                      className="flex-1 md:flex-none px-4 py-3 md:py-2 rounded-lg border-[#E5E7EB] dark:bg-[#181B23] border dark:border-[#E5E7EB] dark:text-[#A0AFC0] hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50 min-h-[44px] md:min-h-0"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>

                    {/* Page numbers - Hidden on mobile if too many pages */}
                    <div className="hidden md:flex items-center space-x-2">
                      <button
                        className={`px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm font-medium transition min-h-[44px] md:min-h-0 ${currentPage === 1 ? 'text-black border-[#0846A6]' : 'bg-[#181B23] text-[#A0AFC0] border-[#E5E7EB] hover:text-white hover:border-[#0846A6]'}`}
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        1
                      </button>
                      {currentPage > 3 && <span className="text-[#A0AFC0]">...</span>}
                      {currentPage !== 1 && currentPage !== totalPages && (
                        <button
                          className="px-3 py-2 rounded-lg border-[#E5E7EB] border text-sm font-medium dark:bg-[#0846A6] text-black dark:border-[#0846A6] min-h-[44px] md:min-h-0"
                          disabled
                        >
                          {formatThousands(currentPage)}
                        </button>
                      )}
                      {currentPage < totalPages - 2 && <span className="text-[#A0AFC0]">...</span>}
                      {totalPages > 1 && (
                        <button
                          className={`px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm font-medium transition min-h-[44px] md:min-h-0 ${currentPage === totalPages ? 'dark:bg-[#0846A6] text-black border-[#0846A6]' : 'dark:bg-[#181B23] text-[#A0AFC0] border-[#E5E7EB] hover:text-white hover:border-[#0846A6]'}`}
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          {formatThousands(totalPages)}
                        </button>
                      )}
                    </div>

                    <button
                      className="flex-1 md:flex-none px-4 py-3 md:py-2 rounded-lg dark:bg-[#181B23] border border-[#E5E7EB] dark:border-[#E5E7EB] text-[#A0AFC0] hover:text-white hover:border-[#0846A6] transition disabled:opacity-50 min-h-[44px] md:min-h-0"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DataTableCard>
        )}
      </div>
    </div>
  );
}