"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { DataTableCard } from "@/components/ui/data-table-card"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Filter, TrendingUp, Clock, CheckCircle, ChevronLeft, ChevronRight, Coins, AlertTriangle } from "lucide-react"
import { useCommissionData, useCommissionHistory } from "@/hooks/use-commission"
import { useTimeRange } from "@/hooks/use-time-range"
import { Skeleton } from "@/components/ui/skeleton"
import type { CommissionHistory } from "@/lib/services/commission-service"
import { formatThousands } from "@/lib/utils"
import { useSetPageTitle } from "@/hooks/use-page-title"
import { MobileTable } from "@/components/ui/mobile-table"

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

  const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError, refetch: refetchSummary } = useCommissionData(timeRange)
  const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError, refetch: refetchHistory } = useCommissionHistory(timeRange, typeFilter !== "all" ? typeFilter : undefined, statusFilter !== "all" ? statusFilter : undefined, currentPage, itemsPerPage, currencyFilter !== "all" ? currencyFilter : undefined)

  // Use backend-paginated data directly
  const paginatedCommissions: CommissionHistory[] = historyData?.commissions || []
  const totalPages = historyData?.totalPages || 1
  const totalResults = historyData?.total || 0

  // Remove frontend-only currency filtering
  // const filteredCommissions = currencyFilter !== "all"
  //   ? paginatedCommissions.filter((c) => c.currency === currencyFilter)
  //   : paginatedCommissions
  const filteredCommissions = paginatedCommissions;

  console.log("COMMISSIONS", filteredCommissions);

  // Calculate summary stats from filtered data
  const totalEarned = summaryData?.earnings?.totalEarnings ?? 0
  const pendingAmount = summaryData?.stats?.pendingAmount ?? 0
  const withdrawnAmount = summaryData?.stats?.totalWithdrawals ?? 0
  const c1Total = summaryData?.stats.totalC1 ?? 0
  const c2Total = summaryData?.stats.totalC2 ?? 0
  const c3Total = summaryData?.stats.totalC3 ?? 0
  const currency = summaryData?.earnings?.currency || 'VP'
  const monthlyGrowth = summaryData?.stats?.monthlyGrowth ?? 0
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

  if (isSummaryError || isHistoryError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#E5E7EB] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Commissions Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your commissions right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchSummary(); refetchHistory(); }} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        <PageHeader title="COMMISSIONS" description="My commissions breakdown" />

        {/* Summary Cards Layout - Restored */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Filter Controls Block */}
        <FilterControls>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#A0AFC0]" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
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

            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-[#A0AFC0]" />
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="w-48 dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
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

            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 text-[#A0AFC0]" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48 dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
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
          </div>
        </FilterControls>

        {/* Table Block */}
        {isHistoryLoading ? (
          <div className="dark:bg-[#1A1E2D] border border-[#E5E7EB] dark:border-[#E5E7EB] rounded-lg p-0 w-full">
            <div className="px-6 pt-6 pb-2">
              <Skeleton className="h-6 w-48 mb-4 dark:bg-[#E5E7EB]" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5E7EB] dark:divide-[#E5E7EB]">
                <thead>
                  <tr>
                    {["Date", "Source User", "Type", "Amount", "Description"].map((col) => (
                      <th key={col} className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">
                        <Skeleton className="h-4 w-20 dark:bg-[#E5E7EB]" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#E5E7EB]">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5].map(j => (
                        <td key={j} className="px-4 py-2 whitespace-nowrap">
                          <Skeleton className="h-6 w-full dark:bg-[#E5E7EB]" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : isHistoryError ? (
          <div className="text-red-500">Failed to load commission history.</div>
        ) : (
          <DataTableCard
            title="COMMISSION HISTORY"
            subtitle={`Showing ${formatThousands(filteredCommissions.length)} of ${formatThousands(totalResults)} commissions`}
            showExport
            onExport={() => console.log("Export data")}
          >
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Source User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 dark:text-[#A0AFC0]">No commissions found</td>
                  </tr>
                ) : (
                  filteredCommissions.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{c.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="font-bold text-white">{c.source}</div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{
                        (() => {
                          const { label, color } = getTypeLabelAndColor(c.type)
                          return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${color}`}>{label}</span>
                        })()
                      }</td>
                      <td className="px-4 py-2 whitespace-nowrap dark:text-[#0846A6] font-bold">{formatThousands(c.amount.toFixed(2))} {c.currency}</td>
                      <td className="px-4 py-2 whitespace-nowrap dark:text-[#A0AFC0] text-sm max-w-48 truncate" title={c.description}>
                        {c.commission_percentage * 100}% on {(formatThousands(c.volume_amount.toFixed(0)))} VP for star <a
                          href={`https://polygonscan.com/nft/0x7681a8fba3b29533c7289dfab91dda24a48228ec/${c.token_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0846A6] underline hover:text-[#00B28C] transition"
                        >#{c.token_id}</a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
              <div className="flex-1 text-[#A0AFC0] text-sm">
                Page {formatThousands(currentPage)} of {formatThousands(totalPages)} ({formatThousands(totalResults)} total results)
              </div>
              <div className="flex items-center space-x-4 justify-end">
                {/* Items per page dropdown */}
                <Select value={String(itemsPerPage)} onValueChange={v => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-24 dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] dark:border border-none">
                    {[5, 10, 20, 50].map(opt => (
                      <SelectItem key={opt} value={String(opt)} className="text-white dark:hover:bg-[#E5E7EB]">{opt} / page</SelectItem>
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
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${currentPage === 1 ? 'dark:bg-[#0846A6] text-black dark:border-[#0846A6]' : 'dark:bg-[#181B23] text-[#A0AFC0] dark:border-[#E5E7EB] hover:text-white dark:hover:border-[#0846A6]'}`}
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
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${currentPage === totalPages ? 'dark:bg-[#0846A6] text-black dark:border-[#0846A6]' : 'dark:bg-[#181B23] text-[#A0AFC0] dark:border-[#E5E7EB] hover:text-white dark:hover:border-[#0846A6]'}`}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  className={`px-4 py-2 rounded-lg dark:bg-[#181B23] border dark:border-[#E5E7EB] text-[#A0AFC0] hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50`}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </DataTableCard>
        )}
      </div>
    </div>
  )
}
