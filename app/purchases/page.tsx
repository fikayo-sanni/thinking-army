"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { DataTableCard } from "@/components/ui/data-table-card"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { usePurchasesData, usePurchaseHistory } from "@/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { formatThousands, formatShortNumber, groupChartData, formatXAxisLabel } from "@/lib/utils"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
  const [timeRange, setTimeRange] = useState("this-week")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch data using custom hooks
  const { data: purchasesData, isLoading: isDataLoading, error: dataError, refetch: refetchData } = usePurchasesData({
    timeRange,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page: currentPage,
    limit: itemsPerPage
  })
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

  // Loading states
  if (isDataLoading || isHistoryLoading) {
    return (
      <div className="min-h-screen">
        <div className="p-6 space-y-6">
          <PageHeader title="NETWORK ACTIVITY" description="Tracking my network's activity" />

          {/* Loading skeleton for summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="dark:bg-[#1A1E2D] dark:border dark:border-[#2C2F3C] rounded-lg p-6">
                <Skeleton className="h-4 w-24 mb-2 dark:bg-[#2C2F3C]" />
                <Skeleton className="h-8 w-32 dark:bg-[#2C2F3C]" />
              </div>
            ))}
          </div>

          {/* Loading skeleton for chart */}
          <div className="dark:bg-[#1A1E2D] dark:border dark:border-[#2C2F3C] rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4 dark:bg-[#2C2F3C]" />
            <Skeleton className="h-64 w-full dark:bg-[#2C2F3C]" />
          </div>

          {/* Loading skeleton for table */}
          <div className="dark:bg-[#1A1E2D] dark:border dark:border-[#2C2F3C] rounded-lg p-6">
            <Skeleton className="h-6 w-48 mb-4 dark:bg-[#2C2F3C]" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full dark:bg-[#2C2F3C]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error states
  if (dataError || historyError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Network Activity Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your network activity right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchData(); refetchHistory(); }} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const purchases = historyData?.purchases || []
  const overview = purchasesData?.overview
  const chartData = purchasesData?.charts || []
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
  const groupedChartData = groupChartData(chartData, groupBy);

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Page Title Block */}
        <PageHeader title="NETWORK ACTIVITY" description="Tracking my network's activity" />

        {/* Summary Stats - Moved to top for better hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="TOTAL VOLUME POINTS IN PERIOD"
            value={`${formatThousands(parseInt(overview?.totalSpent.toFixed(1)) || '0.0')} ${overview?.currency || 'VP'}`}
            color="dark:text-[#0846A6]"
          />
          <SummaryCard
            title="TOTAL PURCHASES IN PERIOD"
            value={formatThousands(overview?.totalPurchases) || 0}
            color="dark:text-[#00B28C]"
          />
        </div>

        {/* Filter Controls Block */}
        <FilterControls>
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4 text-[#A0AFC0]" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 dark:bg-[#1A1E2D] dark:border-[#2C2F3C] text-white">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-none">
                <SelectItem value="all-time" className="text-white hover:bg-[#2C2F3C]">
                  All Time
                </SelectItem>
                <SelectItem value="this-week" className="text-white hover:bg-[#2C2F3C]">
                  This Week
                </SelectItem>
                <SelectItem value="this-month" className="text-white hover:bg-[#2C2F3C]">
                  This Month
                </SelectItem>
                <SelectItem value="this-quarter" className="text-white hover:bg-[#2C2F3C]">
                  This Quarter
                </SelectItem>
                <SelectItem value="last-week" className="text-white hover:bg-[#2C2F3C]">
                  Last Week
                </SelectItem>
                <SelectItem value="last-month" className="text-white hover:bg-[#2C2F3C]">
                  Last Month
                </SelectItem>
                <SelectItem value="last-quarter" className="text-white hover:bg-[#2C2F3C]">
                  Last Quarter
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterControls>

        {/* Network Purchases Over Time Chart */}
        {chartData.length ? <div style={{ width: "70%", transform: "scale(0.9)", transformOrigin: "top left" }} className="mb-4">
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
                        <div className="dark:bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-3 shadow-lg">
                          <div className="dark:text-white font-medium mb-2">{label}</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#0846A6]">Purchases:</span>
                              <span className="text-white font-medium">{formatThousands(String(payload[0]?.value))}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#00B28C]">Volume:</span>
                              <span className="text-white font-medium">{formatThousands(String(parseInt(String(payload[1]?.value))))} VP</span>
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
        </div> : <></>}

        {/* Purchases Table Block */}
        <DataTableCard
          title="NETWORK ACTIVITY HISTORY"
          subtitle={`Showing ${purchases.length} of ${historyData?.total || 0} purchases`}
          showExport
          onExport={() => console.log("Export data")}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] dark:divide-[#2C2F3C]">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Token ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Buyer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="dark:border-[#2C2F3C] dark:hover:bg-[#1A1E2D]/30 border-b">
                    <td className="px-4 py-2 dark:text-[#A0AFC0]">
                      {new Date(purchase.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2 dark:text-white font-medium uppercase">{purchase.tokenId}</td>
                    <td className="px-4 py-2 dark:text-[#0846A6] font-bold">{formatThousands(parseInt(String(purchase.amount)))} {purchase.currency}</td>
                    <td className="px-4 py-2 dark:text-[#A0AFC0]">{purchase.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {purchases.length === 0 && (
            <div className="text-center py-12">
              <div className="dark:text-[#A0AFC0] text-lg mb-2">No purchases found</div>
              <div className="dark:text-[#A0AFC0] text-sm">Try adjusting your filters to see more results</div>
            </div>
          )}

          {/* Pagination styled like commissions page */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 text-[#A0AFC0] text-sm">
              Page {currentPage} of {totalPages} ({historyData?.total || 0} total results)
            </div>
            <div className="flex items-center space-x-4 justify-end">
              {/* Items per page dropdown */}
              <Select value={String(itemsPerPage)} onValueChange={v => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-24 dark:bg-[#1A1E2D] dark:border-[#2C2F3C] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
                  {[5, 10, 20, 50].map(opt => (
                    <SelectItem key={opt} value={String(opt)} className="text-white dark:hover:bg-[#2C2F3C]">{opt} / page</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Pagination controls */}
              <button
                className={`px-4 py-2 rounded-lg border-[#E5E7EB] dark:bg-[#181B23] border dark:border-[#2C2F3C] dark:text-[#A0AFC0] hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {/* First page */}
              <button
                className={`px-3 py-2 rounded-lg border-[#E5E7EB] border text-sm font-medium transition ${currentPage === 1 ? 'text-black border-[#0846A6]' : 'bg-[#181B23] text-[#A0AFC0] border-[#2C2F3C] hover:text-white hover:border-[#0846A6]'}`}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                1
              </button>
              {/* Ellipsis if needed */}
              {currentPage > 3 && <span className="text-[#A0AFC0]">...</span>}
              {/* Current page (if not first/last) */}
              {currentPage !== 1 && currentPage !== totalPages && (
                <button
                  className="px-3 py-2 rounded-lg border text-sm font-medium dark:bg-[#0846A6] text-black dark:border-[#0846A6]"
                  disabled
                >
                  {currentPage}
                </button>
              )}
              {/* Ellipsis if needed */}
              {currentPage < totalPages - 2 && <span className="text-[#A0AFC0]">...</span>}
              {/* Last page */}
              {totalPages > 1 && (
                <button
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${currentPage === totalPages ? 'dark:bg-[#0846A6] text-black border-[#0846A6]' : 'dark:bg-[#181B23] text-[#A0AFC0] border-[#2C2F3C] hover:text-white hover:border-[#0846A6]'}`}
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  {totalPages}
                </button>
              )}
              <button
                className={`px-4 py-2 rounded-lg dark:bg-[#181B23] border dark:border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#0846A6] transition disabled:opacity-50`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </DataTableCard>
      </div>
    </div>
  );
}