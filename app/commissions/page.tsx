"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { DataTableCard } from "@/components/ui/data-table-card"
import { MetricCard } from "@/components/ui/metric-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Filter, TrendingUp, Clock, CheckCircle, ChevronLeft, ChevronRight, Coins, AlertTriangle, Plus } from "lucide-react"
import {
  useCommissionHistory,
  useCommissionEarnings,
  useCommissionStats,
  usePendingCommissions,
  useCommissionChartData
} from "@/hooks/use-commission"
import { useTimeRange } from "@/hooks/use-time-range"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CommissionsSummaryCardsSkeleton,
  CommissionsTableSkeleton,
  CommissionsPendingSkeleton,
  CommissionsChartSkeleton
} from "@/components/commissions/commissions-skeletons"
import type { CommissionHistory } from "@/lib/services/commission-service"
import { formatThousands } from "@/lib/utils"
import { useSetPageTitle } from "@/hooks/use-page-title"
import { MobileTable } from "@/components/ui/mobile-table"
import { MobileFilterControls } from "@/components/layout/mobile-filter-controls"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CommissionsPage() {
  // Set page title
  useSetPageTitle("Commissions");

  const [typeFilter, setTypeFilter] = useState("all")
  const [timeRange, setTimeRange] = useTimeRange("this-week")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currencyFilter, setCurrencyFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [typeFilter, currencyFilter, statusFilter, timeRange])

  // 🚀 OPTIMIZED: Individual hooks for parallel loading
  const { 
    data: earningsData, 
    isLoading: isEarningsLoading, 
    isError: isEarningsError, 
    refetch: refetchEarnings 
  } = useCommissionEarnings(timeRange)
  
  const { 
    data: statsData, 
    isLoading: isStatsLoading, 
    isError: isStatsError, 
    refetch: refetchStats 
  } = useCommissionStats(timeRange)
  
  const { 
    data: historyData, 
    isLoading: isHistoryLoading, 
    isError: isHistoryError, 
    refetch: refetchHistory 
  } = useCommissionHistory(timeRange, typeFilter !== "all" ? typeFilter : undefined, statusFilter !== "all" ? statusFilter : undefined, currentPage, itemsPerPage, currencyFilter !== "all" ? currencyFilter : undefined)

  // ✨ NEW: Add pending commissions and chart data
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    isError: isPendingError,
    refetch: refetchPending,
  } = usePendingCommissions();

  const {
    data: chartData,
    isLoading: isChartLoading,
    isError: isChartError,
    refetch: refetchChart,
  } = useCommissionChartData(timeRange);

  // Use backend-paginated data directly
  const paginatedCommissions: CommissionHistory[] = historyData?.commissions || []
  const totalPages = historyData?.totalPages || 1
  const totalResults = historyData?.total || 0

  // Remove frontend-only currency filtering - using backend filtering
  const filteredCommissions = paginatedCommissions;

  // Calculate summary stats from individual data sources
  const totalEarned = earningsData?.totalEarnings ?? 0
  const pendingAmount = statsData?.pendingAmount ?? 0
  const withdrawnAmount = statsData?.totalWithdrawals ?? 0
  const c1Total = statsData?.totalC1 ?? 0
  const c2Total = statsData?.totalC2 ?? 0
  const c3Total = statsData?.totalC3 ?? 0
  const currency = earningsData?.currency || 'VP'
  const monthlyGrowth = statsData?.monthlyGrowth ?? 0
  const monthlyGrowthRounded = `${monthlyGrowth >= 0 ? '+' : ''}${monthlyGrowth.toFixed(2)}`

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">PAID</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">PENDING</Badge>
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">PROCESSING</Badge>
      default:
        return <Badge className="bg-[#E5E7EB] text-[#A0AFC0]">{status.toUpperCase()}</Badge>
    }
  }

  const getTypeLabelAndColor = (type: string) => {
    switch (type) {
      case "C1":
        return { label: "C1", color: "bg-[#0846A6]/20 text-[#0846A6] border-[#0846A6]/30" };
      case "C2":
        return { label: "C2", color: "bg-[#00B28C]/20 text-[#00B28C] border-[#00B28C]/30" };
      case "C3":
        return { label: "C3", color: "bg-[#6F00FF]/20 text-[#6F00FF] border-[#6F00FF]/30" };
      default:
        return { label: type.toUpperCase(), color: "bg-[#E5E7EB] text-[#A0AFC0]" };
    }
  }

  const getCurrencyBadge = (currency: string) => {
    const colors = {
      USDC: "bg-[#0846A6]/20 text-[#0846A6] border-[#0846A6]/30",
      USDT: "bg-[#00B28C]/20 text-[#00B28C] border-[#00B28C]/30",
    }
    return <Badge className={colors[currency as keyof typeof colors] || "bg-[#E5E7EB] text-[#A0AFC0]"}>{currency}</Badge>
  }

  // Check if any critical data failed to load
  const hasCriticalError = isEarningsError || isStatsError || isHistoryError;

  if (hasCriticalError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#E5E7EB] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Commissions Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your commissions right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchEarnings(); refetchStats(); refetchHistory(); refetchPending(); refetchChart(); }} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <PageHeader title="COMMISSIONS" description="My commissions breakdown" />

        {/* Summary Cards Layout - Load independently */}
        {(isEarningsLoading || isStatsLoading) ? (
          <CommissionsSummaryCardsSkeleton />
        ) : (earningsData && statsData) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Total Earned */}
            <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] col-span-1 md:col-span-1">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#0846A6]/10">
                    <TrendingUp className="h-6 w-6 text-[#0846A6]" />
                  </div>
                  <Badge className={monthlyGrowth >= 0 ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>{monthlyGrowthRounded}%</Badge>
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{formatThousands(Number(totalEarned).toFixed(0))} {currency}</div>
                <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">TOTAL EARNED</div>
              </CardContent>
            </Card>
            
            {/* Commission Types Breakdown */}
            <Card className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB] col-span-1 md:col-span-1 flex flex-col justify-center">
              <CardContent className="p-6 flex flex-col h-full justify-center">
                <div className="text-[#A0AFC0] text-sm uppercase tracking-wider mb-2">COMMISSION TYPES</div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#0846A6] mr-2"></span>
                      <span className="text-[#0846A6] font-bold">C1</span>
                    </span>
                    <span className="text-white font-medium">{formatThousands(Number(c1Total).toFixed(0))} {currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#00B28C] mr-2"></span>
                      <span className="text-[#00B28C] font-bold">C2</span>
                    </span>
                    <span className="text-white font-medium">{formatThousands(Number(c2Total).toFixed(0))} {currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#6F00FF] mr-2"></span>
                      <span className="text-[#6F00FF] font-bold">C3</span>
                    </span>
                    <span className="text-white font-medium">{formatThousands(Number(c3Total).toFixed(0))} {currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-[#A0AFC0] text-center py-8">No commission data available.</div>
        )}

        {/* Filter Controls Block */}
        <MobileFilterControls title="Commission Filters">
          <div className="flex items-center space-x-2 md:space-x-2">
            <Filter className="h-4 w-4 text-[#A0AFC0] hidden md:block" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 md:h-auto dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                <SelectValue placeholder="Commission type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-none">
                <SelectItem value="all" className="text-white hover:bg-[#E5E7EB]">
                  All Types
                </SelectItem>
                <SelectItem value="C1" className="text-white hover:bg-[#E5E7EB]">
                  C1
                </SelectItem>
                <SelectItem value="C2" className="text-white hover:bg-[#E5E7EB]">
                  C2
                </SelectItem>
                <SelectItem value="C3" className="text-white hover:bg-[#E5E7EB]">
                  C3
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 md:space-x-2">
            <Coins className="h-4 w-4 text-[#A0AFC0] hidden md:block" />
            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 md:h-auto dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-none">
                <SelectItem value="all" className="text-white hover:bg-[#E5E7EB]">
                  All Currencies
                </SelectItem>
                <SelectItem value="GCC1" className="text-white hover:bg-[#E5E7EB]">
                  GCC1
                </SelectItem>
                <SelectItem value="USDC" className="text-white hover:bg-[#E5E7EB]">
                  USDC
                </SelectItem>
                <SelectItem value="USDT" className="text-white hover:bg-[#E5E7EB]">
                  USDT
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 md:space-x-2">
            <CalendarDays className="h-4 w-4 text-[#A0AFC0] hidden md:block" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-48 h-12 md:h-auto dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                <SelectValue placeholder="Time range" />
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

        {/* ✨ NEW: Pending Commissions Section - Load independently */}
        {isPendingLoading ? (
          <CommissionsPendingSkeleton />
        ) : (pendingData && pendingData.length > 0) ? (
          <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#FFA500]" />
                  <span>PENDING COMMISSIONS</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  {pendingData.length} PENDING
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingData.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-3 border border-[#2C2F3C] rounded-lg">
                  <div className="space-y-1">
                    <div className="text-white font-medium">{formatThousands(commission.amount)} {commission.currency}</div>
                    <div className="text-[#A0AFC0] text-sm">{commission.type} • From: {commission.source} • Expected: {commission.expectedDate}</div>
                  </div>
                  {getStatusBadge("pending")}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : isPendingError ? (
          <div className="text-red-500 text-center py-8">Failed to load pending commissions.</div>
        ) : null}

        {/* Table Block - Load independently */}
        {isHistoryLoading ? (
          <CommissionsTableSkeleton />
        ) : isHistoryError ? (
          <div className="text-red-500 text-center py-8">Failed to load commission history.</div>
        ) : (
          <DataTableCard
            title="COMMISSION HISTORY"
            subtitle={`Showing ${formatThousands(filteredCommissions.length)} of ${formatThousands(totalResults)} commissions`}
            showExport
            onExport={() => console.log("Export data")}
          >
            <MobileTable
              columns={[
                {
                  key: 'date',
                  header: 'Date',
                  mobileLabel: 'Date'
                },
                {
                  key: 'source',
                  header: 'Source User',
                  mobileLabel: 'From',
                  render: (value) => <div className="font-bold dark:text-white text-gray-900">{value}</div>
                },
                {
                  key: 'type',
                  header: 'Type',
                  render: (value) => {
                    const { label, color } = getTypeLabelAndColor(value);
                    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${color}`}>{label}</span>;
                  }
                },
                {
                  key: 'amount',
                  header: 'Amount',
                  render: (value, row) => (
                    <span className="dark:text-[#0846A6] text-[#0846A6] font-bold">
                      {formatThousands(value.toFixed(2))} {row.currency}
                    </span>
                  )
                },
                {
                  key: 'description',
                  header: 'Description',
                  mobileLabel: 'Details',
                  hiddenOnMobile: false,
                  render: (_, row) => (
                    <div className="dark:text-[#A0AFC0] text-gray-600 text-sm">
                      {row.commission_percentage * 100}% on {formatThousands(row.volume_amount.toFixed(0))} VP for star{' '}
                      <a
                        href={`https://polygonscan.com/nft/0x7681a8fba3b29533c7289dfab91dda24a48228ec/${row.token_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0846A6] underline hover:text-[#00B28C] transition"
                      >
                        #{row.token_id}
                      </a>
                    </div>
                  )
                }
              ]}
              data={filteredCommissions}
              keyField="id"
              emptyMessage="No commissions found"
            />
            
            {/* Pagination - only show if not error and has data */}
            {!isHistoryError && filteredCommissions.length > 0 && (
              <div className="mt-4 space-y-4">
                {/* Mobile Stats */}
                <div className="text-center md:hidden">
                  <div className="text-[#A0AFC0] text-sm">
                    Page {formatThousands(currentPage)} of {formatThousands(totalPages)}
                  </div>
                  <div className="text-[#A0AFC0] text-xs">
                    {formatThousands(totalResults)} total results
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Desktop Stats */}
                  <div className="hidden md:block flex-1 text-[#A0AFC0] text-sm">
                    Page {formatThousands(currentPage)} of {formatThousands(totalPages)} ({formatThousands(totalResults)} total results)
                  </div>

                  {/* Items per page - Full width on mobile */}
                  <div className="w-full md:w-auto">
                    <Select value={String(itemsPerPage)} onValueChange={v => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                      <SelectTrigger className="w-full md:w-32 h-12 md:h-auto dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] dark:border border-none">
                        {[5, 10, 20, 50].map(opt => (
                          <SelectItem key={opt} value={String(opt)} className="text-white dark:hover:bg-[#E5E7EB]">{opt} / page</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pagination controls - Simplified for mobile */}
                  <div className="flex items-center space-x-2 w-full md:w-auto justify-center">
                    <button
                      className="flex-1 md:flex-none px-4 py-3 md:py-2 rounded-lg border-[#E5E7EB] dark:bg-[#181B23] border dark:border-[#2C2F3C] dark:text-[#A0AFC0] hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50 min-h-[44px] md:min-h-0"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>

                    {/* Page numbers - Hidden on mobile if too many pages */}
                    <div className="hidden md:flex items-center space-x-2">
                      <button
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition min-h-[44px] md:min-h-0 ${currentPage === 1 ? 'dark:bg-[#0846A6] text-black dark:border-[#0846A6]' : 'dark:bg-[#181B23] text-[#A0AFC0] dark:border-[#E5E7EB] hover:text-white dark:hover:border-[#0846A6]'}`}
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        1
                      </button>
                      {currentPage > 3 && <span className="text-[#A0AFC0]">...</span>}
                      {currentPage !== 1 && currentPage !== totalPages && (
                        <button
                          className="px-3 py-2 rounded-lg border text-sm font-medium dark:bg-[#0846A6] text-black dark:border-[#0846A6] min-h-[44px] md:min-h-0"
                          disabled
                        >
                          {currentPage}
                        </button>
                      )}
                      {currentPage < totalPages - 2 && <span className="text-[#A0AFC0]">...</span>}
                      {totalPages > 1 && (
                        <button
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition min-h-[44px] md:min-h-0 ${currentPage === totalPages ? 'dark:bg-[#0846A6] text-black dark:border-[#0846A6]' : 'dark:bg-[#181B23] text-[#A0AFC0] dark:border-[#E5E7EB] hover:text-white dark:hover:border-[#0846A6]'}`}
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>

                    <button
                      className="flex-1 md:flex-none px-4 py-3 md:py-2 rounded-lg dark:bg-[#181B23] border dark:border-[#E5E7EB] text-[#A0AFC0] hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50 min-h-[44px] md:min-h-0"
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
  )
}
