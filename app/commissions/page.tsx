"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { DataTableCard } from "@/components/ui/data-table-card"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Filter, TrendingUp, Clock, CheckCircle, ChevronLeft, ChevronRight, Coins } from "lucide-react"
import { useCommissionData, useCommissionHistory } from "@/hooks/use-commission"
import { Skeleton } from "@/components/ui/skeleton"
import type { CommissionHistory } from "@/lib/services/commission-service"

export default function CommissionsPage() {
  const [typeFilter, setTypeFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("last-month")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currencyFilter, setCurrencyFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useCommissionData(timeRange)
  const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError } = useCommissionHistory(timeRange, typeFilter !== "all" ? typeFilter : undefined, statusFilter !== "all" ? statusFilter : undefined, currentPage, itemsPerPage)

  const commissionsData: CommissionHistory[] = historyData?.commissions || []
  const earnings = summaryData?.earnings
  const stats = summaryData?.stats
  const pending = summaryData?.pending
  const chartData = summaryData?.chartData

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">PAID</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">PENDING</Badge>
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">PROCESSING</Badge>
      default:
        return <Badge className="bg-[#2C2F3C] text-[#A0AFC0]">{status.toUpperCase()}</Badge>
    }
  }

  const getTypeLabelAndColor = (type: string) => {
    switch (type) {
      case "direct":
        return { label: "C1", color: "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30" };
      case "indirect":
        return { label: "C2", color: "bg-[#00FFC8]/20 text-[#00FFC8] border-[#00FFC8]/30" };
      case "bonus":
        return { label: "C3", color: "bg-[#6F00FF]/20 text-[#6F00FF] border-[#6F00FF]/30" };
      default:
        return { label: type.toUpperCase(), color: "bg-[#2C2F3C] text-[#A0AFC0]" };
    }
  }

  const getCurrencyBadge = (currency: string) => {
    const colors = {
      USDC: "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30",
      USDT: "bg-[#00FFC8]/20 text-[#00FFC8] border-[#00FFC8]/30",
    }
    return <Badge className={colors[currency as keyof typeof colors] || "bg-[#2C2F3C] text-[#A0AFC0]"}>{currency}</Badge>
  }

  // Calculate summary stats
  const totalEarned = earnings?.totalEarnings ?? 0
  const pendingAmount = stats?.pendingAmount ?? 0
  const withdrawnAmount = stats?.totalWithdrawals ?? 0
  const c1Total = commissionsData.filter((c: CommissionHistory) => c.type === "direct").reduce((sum, c) => sum + c.amount, 0)
  const c2Total = commissionsData.filter((c: CommissionHistory) => c.type === "indirect").reduce((sum, c) => sum + c.amount, 0)
  const c3Total = commissionsData.filter((c: CommissionHistory) => c.type === "bonus").reduce((sum, c) => sum + c.amount, 0)
  const currency = earnings?.currency || 'ETH'
  const monthlyGrowth = stats?.monthlyGrowth ?? 0

  // Pagination
  const totalPages = historyData?.totalPages || 1
  const paginatedCommissions = commissionsData

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          <PageHeader title="COMMISSIONS" description="Track your earnings and commission breakdown" />

          {/* Summary Cards Layout - Restored */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Earned */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C] col-span-1 md:col-span-1">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#00E5FF]/10">
                    <TrendingUp className="h-6 w-6 text-[#00E5FF]" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+{monthlyGrowth}%</Badge>
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{Number(totalEarned).toFixed(2)} {currency}</div>
                <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">TOTAL EARNED</div>
              </CardContent>
            </Card>
            {/* Commission Types Breakdown */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C] col-span-1 md:col-span-1 flex flex-col justify-center">
              <CardContent className="p-6 flex flex-col h-full justify-center">
                <div className="text-[#A0AFC0] text-sm uppercase tracking-wider mb-2">COMMISSION TYPES</div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#00E5FF] mr-2"></span>
                      <span className="text-[#00E5FF] font-bold">C1 (Direct)</span>
                    </span>
                    <span className="text-white font-medium">{Number(c1Total).toFixed(2)} {currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#00FFC8] mr-2"></span>
                      <span className="text-[#00FFC8] font-bold">C2 (Level 2)</span>
                    </span>
                    <span className="text-white font-medium">{Number(c2Total).toFixed(2)} {currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#6F00FF] mr-2"></span>
                      <span className="text-[#6F00FF] font-bold">C3 (Level 3)</span>
                    </span>
                    <span className="text-white font-medium">{Number(c3Total).toFixed(2)} {currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Pending */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C] col-span-1 md:col-span-1">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#00E5FF]/10">
                    <Clock className="h-6 w-6 text-[#00E5FF]" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{Number(pendingAmount).toFixed(2)} {currency}</div>
                <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">PENDING</div>
              </CardContent>
            </Card>
            {/* Withdrawn */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C] col-span-1 md:col-span-1">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#00E5FF]/10">
                    <CheckCircle className="h-6 w-6 text-[#00E5FF]" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{Number(withdrawnAmount).toFixed(2)} {currency}</div>
                <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">WITHDRAWN</div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Controls Block */}
          <FilterControls>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-[#A0AFC0]" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                    <SelectValue placeholder="Commission type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
                    <SelectItem value="all" className="text-white hover:bg-[#2C2F3C]">
                      All Types
                    </SelectItem>
                    <SelectItem value="C1" className="text-white hover:bg-[#2C2F3C]">
                      C1 (Direct)
                    </SelectItem>
                    <SelectItem value="C2" className="text-white hover:bg-[#2C2F3C]">
                      C2 (Level 2)
                    </SelectItem>
                    <SelectItem value="C3" className="text-white hover:bg-[#2C2F3C]">
                      C3 (Level 3)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-[#A0AFC0]" />
                <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                  <SelectTrigger className="w-48 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
                    <SelectItem value="all" className="text-white hover:bg-[#2C2F3C]">
                      All Currencies
                    </SelectItem>
                    <SelectItem value="USDC" className="text-white hover:bg-[#2C2F3C]">
                      USDC
                    </SelectItem>
                    <SelectItem value="USDT" className="text-white hover:bg-[#2C2F3C]">
                      USDT
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-[#A0AFC0]" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
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

              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-[#A0AFC0]" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
                    <SelectItem value="all" className="text-white hover:bg-[#2C2F3C]">
                      All Statuses
                    </SelectItem>
                    <SelectItem value="paid" className="text-white hover:bg-[#2C2F3C]">
                      Paid
                    </SelectItem>
                    <SelectItem value="pending" className="text-white hover:bg-[#2C2F3C]">
                      Pending
                    </SelectItem>
                    <SelectItem value="processing" className="text-white hover:bg-[#2C2F3C]">
                      Processing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FilterControls>

          {/* Table Block */}
          {isHistoryLoading ? (
            <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-0 w-full">
              <div className="px-6 pt-6 pb-2">
                <Skeleton className="h-6 w-48 mb-4 bg-[#2C2F3C]" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2C2F3C]">
                  <thead>
                    <tr>
                      {["Date","Source User","Type","Amount","Status","Transaction ID"].map((col) => (
                        <th key={col} className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">
                          <Skeleton className="h-4 w-20 bg-[#2C2F3C]" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C2F3C]">
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <tr key={i}>
                        {[1,2,3,4,5,6].map(j => (
                          <td key={j} className="px-4 py-2 whitespace-nowrap">
                            <Skeleton className="h-6 w-full bg-[#2C2F3C]" />
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
              subtitle={`Showing ${paginatedCommissions.length} of ${historyData?.total || 0} commissions`}
              showExport
              onExport={() => console.log("Export data")}
            >
              <table className="min-w-full divide-y divide-[#2C2F3C]">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Source User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2F3C]">
                  {paginatedCommissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-[#A0AFC0]">No commissions found</td>
                    </tr>
                  ) : (
                    paginatedCommissions.map((c) => (
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
                        <td className="px-4 py-2 whitespace-nowrap text-[#00E5FF] font-bold">{c.amount.toFixed(2)} {c.currency}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{getStatusBadge(c.status)}</td>
                        <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-[#A0AFC0] max-w-32 truncate" title={c.transactionId}>
                          {c.transactionId}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-4">
                <div className="flex-1 text-[#A0AFC0] text-sm">
                  Page {currentPage} of {totalPages} ({historyData?.total || 0} total results)
                </div>
                <div className="flex items-center space-x-2 justify-end">
                  <button
                    className={`px-4 py-2 rounded-lg bg-[#181B23] border border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF] transition disabled:opacity-50`}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition
                        ${page === currentPage
                          ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                          : 'bg-[#181B23] text-[#A0AFC0] border-[#2C2F3C] hover:text-white hover:border-[#00E5FF]'}
                      `}
                      onClick={() => setCurrentPage(page)}
                      disabled={page === currentPage}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className={`px-4 py-2 rounded-lg bg-[#181B23] border border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF] transition disabled:opacity-50`}
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
    </ModernSidebar>
  )
}
