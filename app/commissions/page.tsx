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
};

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
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-semibold text-[#202124] dark:text-[#E6E6E6]">
            Commissions
          </h1>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-9 bg-white dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] w-48">
                <CalendarDays className="mr-2 h-4 w-4 text-[#5F6368] dark:text-[#A0A0A0]" />
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
          {(isEarningsLoading || isStatsLoading) ? (
            <CommissionsSummaryCardsSkeleton />
          ) : (earningsData && statsData) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Earned */}
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <TrendingUp className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Total Earned</h3>
                      <p className={cardStyles.subtitle}>All time earnings</p>
                    </div>
                  </div>
                  <Badge className={monthlyGrowth >= 0 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                    {monthlyGrowthRounded}%
                  </Badge>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {formatThousands(Number(totalEarned).toFixed(0))} {currency}
                      </div>
                      <div className={cardStyles.metric.label}>
                        Total Earnings
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Types Breakdown */}
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <Coins className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Commission Types</h3>
                      <p className={cardStyles.subtitle}>Breakdown by type</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className="space-y-3">
                    <div className={cardStyles.metric.container}>
                      <div className="flex items-center justify-between">
                        <span className={cardStyles.metric.label}>C1</span>
                        <span className={cardStyles.metric.value}>{formatThousands(Number(c1Total).toFixed(0))} {currency}</span>
                      </div>
                    </div>
                    <div className={cardStyles.metric.container}>
                      <div className="flex items-center justify-between">
                        <span className={cardStyles.metric.label}>C2</span>
                        <span className={cardStyles.metric.value}>{formatThousands(Number(c2Total).toFixed(0))} {currency}</span>
                      </div>
                    </div>
                    <div className={cardStyles.metric.container}>
                      <div className="flex items-center justify-between">
                        <span className={cardStyles.metric.label}>C3</span>
                        <span className={cardStyles.metric.value}>{formatThousands(Number(c3Total).toFixed(0))} {currency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Commissions */}
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <Clock className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Pending</h3>
                      <p className={cardStyles.subtitle}>Processing commissions</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {formatThousands(Number(pendingAmount).toFixed(0))} {currency}
                      </div>
                      <div className={cardStyles.metric.label}>
                        Pending Amount
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[#5F6368] dark:text-[#A0A0A0] text-center py-8">No commission data available.</div>
          )}

          {/* Filter Controls */}
          <div className={cardStyles.base}>
            <div className={cardStyles.header}>
              <div className={cardStyles.headerLeft}>
                <div className={cardStyles.iconContainer}>
                  <Filter className={cardStyles.icon} />
                </div>
                <div>
                  <h3 className={cardStyles.title}>Filters</h3>
                  <p className={cardStyles.subtitle}>Refine commission view</p>
                </div>
              </div>
            </div>
            <div className={cardStyles.content}>
              <div className="flex flex-wrap gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9 bg-white dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] w-48">
                    <SelectValue placeholder="Commission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                    <SelectItem value="C2">C2</SelectItem>
                    <SelectItem value="C3">C3</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                  <SelectTrigger className="h-9 bg-white dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] w-48">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="GCC1">GCC1</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Commission History */}
          {isHistoryLoading ? (
            <CommissionsTableSkeleton />
          ) : (
            <div className={cardStyles.base}>
              <div className={cardStyles.header}>
                <div className={cardStyles.headerLeft}>
                  <div className={cardStyles.iconContainer}>
                    <TrendingUp className={cardStyles.icon} />
                  </div>
                  <div>
                    <h3 className={cardStyles.title}>Commission History</h3>
                    <p className={cardStyles.subtitle}>
                      Showing {formatThousands(filteredCommissions.length)} of {formatThousands(totalResults)} commissions
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

                {/* Pagination */}
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
                          className="flex-1 md:flex-none px-4 py-3 md:py-2 rounded-lg border-[#E5E7EB] dark:bg-[#181B23] border dark:border-[#E5E7EB] dark:text-[#A0AFC0] hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50 min-h-[44px] md:min-h-0"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        >
                          Previous
                        </button>

                        {/* Page numbers - Hidden on mobile if too many pages */}
                        <div className="hidden md:flex items-center space-x-2">
                          <button
                            className={`px-3 py-2 rounded-lg border-[#E5E7EB] text-sm font-medium transition min-h-[44px] md:min-h-0 ${currentPage === 1 ? 'dark:bg-[#0846A6] text-black border-[#E5E7EB] dark:border-[#0846A6]' : 'dark:bg-[#181B23] text-[#A0AFC0] border-[#E5E7EB] hover:text-white dark:hover:border-[#0846A6]'}`}
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                          >
                            1
                          </button>
                          {currentPage > 3 && <span className="text-[#A0AFC0]">...</span>}
                          {currentPage !== 1 && currentPage !== totalPages && (
                            <button
                              className="px-3 py-2 rounded-lg border-[#E5E7EB] text-sm font-medium dark:bg-[#0846A6] text-black dark:border-[#0846A6] min-h-[44px] md:min-h-0"
                              disabled
                            >
                              {currentPage}
                            </button>
                          )}
                          {currentPage < totalPages - 2 && <span className="text-[#A0AFC0]">...</span>}
                          {totalPages > 1 && (
                            <button
                              className={`px-3 py-2 rounded-lg border-[#E5E7EB] text-sm font-medium transition min-h-[44px] md:min-h-0 ${currentPage === totalPages ? 'dark:bg-[#0846A6] text-black border-[#E5E7EB] dark:border-[#0846A6]' : 'dark:bg-[#181B23] text-[#A0AFC0] dark:border-[#E5E7EB] border-[#E5E7EB] hover:text-white dark:hover:border-[#0846A6]'}`}
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                            >
                              {totalPages}
                            </button>
                          )}
                        </div>

                        <button
                          className="flex-1 md:flex-none px-4 py-3 md:py-2 rounded-lg dark:bg-[#181B23] border-[#E5E7EB] dark:border-[#E5E7EB] text-[#A0AFC0] hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50 min-h-[44px] md:min-h-0"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Total Earned</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isEarningsLoading ? (
                      <Skeleton className="h-4 w-16 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      `${formatThousands(Number(totalEarned).toFixed(0))} ${currency}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Pending</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      `${formatThousands(Number(pendingAmount).toFixed(0))} ${currency}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Monthly Growth</span>
                  <span className={`text-[14px] font-medium ${monthlyGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      monthlyGrowthRounded + '%'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Commissions Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Pending Commissions
              </h3>
              <div className="space-y-4">
                {isPendingLoading ? (
                  <Skeleton className="h-20 w-full dark:bg-[#2C2F3C] rounded" />
                ) : pendingData && pendingData.length > 0 ? (
                  pendingData.slice(0, 5).map((commission) => (
                    <div key={commission.id} className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-[#297EFF]/10">
                        <Clock className="h-4 w-4 text-[#297EFF]" />
                      </div>
                      <div>
                        <p className="text-[14px] text-[#202124] dark:text-[#E6E6E6]">
                          {formatThousands(commission.amount)} {commission.currency} {commission.type}
                        </p>
                        <span className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">
                          From: {commission.source}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0] text-center">
                    No pending commissions
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
