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
import { CalendarDays, Filter, TrendingUp, Clock, CheckCircle, ChevronLeft, ChevronRight, Coins, AlertTriangle, Plus, Users, Trophy } from "lucide-react"
import {
  useCommissionHistory,
  useCommissionStats as useCommissionEarnings,
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
import { formatThousands, safeFormatDate } from "@/lib/utils"
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
import { format } from "date-fns";

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

  const formatDate = (dateString: string | number) => {
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
  };

  // Commission type labels
  const commissionTypeLabels = {
    c1: 'Direct Commission',
    c2: 'Team Commission',
    c3: 'Leadership Commission'
  };

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
                      <TrendingUp className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Commission Types</h3>
                      <p className={cardStyles.subtitle}>Distribution by type</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { type: 'c1', label: 'Direct Commission', color: '#297EFF', icon: <Users className="w-4 h-4" /> },
                      { type: 'c2', label: 'Team Commission', color: '#00B28C', icon: <Users className="w-4 h-4" /> },
                      { type: 'c3', label: 'Leadership Commission', color: '#6F00FF', icon: <Trophy className="w-4 h-4" /> }
                    ].map(({ type, label, color, icon }) => (
                      <div
                        key={type}
                        className="p-4 rounded-lg border border-[#E4E6EB] dark:border-[#2A2A2A] bg-[#F8F9FB] dark:bg-[#1A2B45]"
                        style={{ borderLeft: `3px solid ${color}` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${color}10` }}
                            >
                              <div style={{ color }}>{icon}</div>
                            </div>
                            <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                              {label}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-transparent"
                            style={{
                              backgroundColor: `${color}10`,
                              color: color
                            }}
                          >
                            {type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-[24px] font-semibold" style={{ color }}>
                          {formatThousands(statsData?.[type] || 0)}
                        </div>
                        <div className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0] mt-1">
                          Total earnings
                        </div>
                      </div>
                    ))}
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
                    <Clock className={cardStyles.icon} />
                  </div>
                  <div>
                    <h3 className={cardStyles.title}>Commission History</h3>
                    <p className={cardStyles.subtitle}>Recent transactions</p>
                  </div>
                </div>
              </div>
              <div className={cardStyles.content}>
                <div className="rounded-lg border border-[#E4E6EB] dark:border-[#2A2A2A] overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F8F9FB] dark:bg-[#1A2B45] hover:bg-[#F8F9FB] dark:hover:bg-[#1A2B45]">
                        <TableHead className="w-[120px] font-medium">Date</TableHead>
                        <TableHead className="font-medium">Type</TableHead>
                        <TableHead className="font-medium">Amount</TableHead>
                        <TableHead className="font-medium">Currency</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isHistoryLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-24 bg-[#F8F9FB] dark:bg-[#2C2F3C]" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16 bg-[#F8F9FB] dark:bg-[#2C2F3C]" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20 bg-[#F8F9FB] dark:bg-[#2C2F3C]" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16 bg-[#F8F9FB] dark:bg-[#2C2F3C]" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20 bg-[#F8F9FB] dark:bg-[#2C2F3C]" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32 bg-[#F8F9FB] dark:bg-[#2C2F3C]" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredCommissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-[#5F6368] dark:text-[#A0A0A0]">
                              <Coins className="h-8 w-8 mb-2 opacity-50" />
                              <p className="text-sm">No commissions found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCommissions.map((commission) => (
                          <TableRow key={commission.id}>
                            <TableCell className="font-medium">
                              {safeFormatDate(commission.date)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="capitalize bg-[#F8F9FB] dark:bg-[#1A2B45] border-[#E4E6EB] dark:border-[#2A2A2A]"
                              >
                                {commissionTypeLabels[commission.type as keyof typeof commissionTypeLabels] || commission.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-[#297EFF] dark:text-[#4D8DFF]">
                              {formatThousands(commission.amount)}
                            </TableCell>
                            <TableCell>{commission.currency}</TableCell>
                            <TableCell>
                              {<span>{(commission.commission_percentage * 100).toFixed(2)}% on {formatThousands(commission.volume_amount.toFixed(0))} VP for star{' '}
                                <a
                                  href={`https://polygonscan.com/nft/0x7681a8fba3b29533c7289dfab91dda24a48228ec/${commission.token_id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#297EFF] font-semibold underline hover:text-[#00B28C] transition"
                                >
                                  #{commission.token_id}
                                </a></span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-[#297EFF]/10 dark:bg-[#4D8DFF]/10 flex items-center justify-center">
                                  <Users className="w-4 h-4 text-[#297EFF] dark:text-[#4D8DFF]" />
                                </div>
                                <span className="text-sm">{commission.source}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                  <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} entries
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-10 px-6 text-[#5F6368] dark:text-[#A0A0A0] border-[#E4E6EB] dark:border-[#2A2A2A] hover:bg-[#F8F9FB] dark:hover:bg-[#1A2B45]"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-10 px-6 text-[#5F6368] dark:text-[#A0A0A0] border-[#E4E6EB] dark:border-[#2A2A2A] hover:bg-[#F8F9FB] dark:hover:bg-[#1A2B45]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
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
