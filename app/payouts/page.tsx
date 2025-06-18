"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { DataTableCard } from "@/components/ui/data-table-card"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PayoutRequestModal } from "@/components/payouts/payout-request-modal"
import {
  CalendarDays,
  Filter,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  Settings,
  CreditCard,
} from "lucide-react"
import { usePayoutsData, usePayoutHistory, usePayoutStats } from "@/hooks/use-payouts"
import { Skeleton } from "@/components/ui/skeleton"

export default function PayoutsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("last-month")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Fetch payout stats and history
  const { data: statsData, isLoading: isStatsLoading, isError: isStatsError } = usePayoutStats(timeRange)
  const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError } = usePayoutHistory({ timeRange, status: statusFilter !== "all" ? statusFilter : undefined }, currentPage, itemsPerPage)

  const payouts = historyData?.payouts || []
  const totalPages = historyData?.totalPages || 1

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">COMPLETED</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">PENDING</Badge>
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">PROCESSING</Badge>
      case "failed":
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">FAILED</Badge>
      default:
        return <Badge className="bg-[#2C2F3C] text-[#A0AFC0]">{status.toUpperCase()}</Badge>
    }
  }

  const getMethodIcon = (method: string) => {
    return method.includes("Wallet") ? (
      <Wallet className="h-4 w-4 text-[#00E5FF]" />
    ) : (
      <CreditCard className="h-4 w-4 text-[#00FFC8]" />
    )
  }

  const handlePayoutRequest = (amount: number, method: string, address: string) => {
    console.log("Payout request:", { amount, method, address })
    // Handle payout request logic here
  }

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="PAYOUTS" description="Manage your withdrawals and payout history" />

          {/* Balance Overview Block */}
          {isStatsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-28 w-full bg-[#2C2F3C] rounded-lg" />
              ))}
            </div>
          ) : isStatsError ? (
            <div className="text-red-500">Failed to load payout stats.</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
                title="TOTAL PAYOUTS"
                value={`${statsData?.totalPayouts ?? 0}`}
              icon={TrendingUp}
                change={{ value: `+${statsData?.monthlyGrowth ?? 0}%`, type: "positive" }}
            />
            <MetricCard
                title="TOTAL AMOUNT"
                value={`${statsData?.totalAmount ?? 0} USDC`}
              icon={CheckCircle}
                change={{ value: `+${statsData?.monthlyGrowth ?? 0}%`, type: "positive" }}
            />
            <MetricCard
              title="PENDING PAYOUTS"
                value={`${statsData?.pendingAmount ?? 0} USDC`}
              icon={Clock}
              change={{ value: "PROCESSING", type: "neutral" }}
            />
          </div>
          )}

          {/* Action Block */}
          <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">WITHDRAWAL ACTIONS</h3>
                  <p className="text-[#A0AFC0] text-sm">
                    Request a payout from your available balance or manage your withdrawal methods
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    variant="outline"
                    className="border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF]"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    MANAGE METHODS
                  </Button>
                  <PayoutRequestModal
                    availableBalance={0} // TODO: Replace with real available balance if/when available from API
                    onRequestPayout={handlePayoutRequest}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Controls Block */}
          <FilterControls>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-[#A0AFC0]" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
                    <SelectItem value="all" className="text-white hover:bg-[#2C2F3C]">
                      All Statuses
                    </SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-[#2C2F3C]">
                      Completed
                    </SelectItem>
                    <SelectItem value="pending" className="text-white hover:bg-[#2C2F3C]">
                      Pending
                    </SelectItem>
                    <SelectItem value="processing" className="text-white hover:bg-[#2C2F3C]">
                      Processing
                    </SelectItem>
                    <SelectItem value="failed" className="text-white hover:bg-[#2C2F3C]">
                      Failed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-[#A0AFC0]" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
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
            </div>
          </FilterControls>

          {/* Payout History Table Block */}
          {isHistoryLoading ? (
            <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-0 w-full">
              <div className="px-6 pt-6 pb-2">
                <Skeleton className="h-6 w-48 mb-4 bg-[#2C2F3C]" />
                </div>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2C2F3C]">
                  <thead>
                    <tr>
                      {["Date","Amount","Status","Method","Currency","Transaction","Notes"].map((col) => (
                        <th key={col} className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">
                          <Skeleton className="h-4 w-20 bg-[#2C2F3C]" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C2F3C]">
                    {[1,2,3,4,5].map(i => (
                      <tr key={i}>
                        {[1,2,3,4,5,6,7].map(j => (
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
            <div className="text-red-500">Failed to load payout history.</div>
          ) : (
            <DataTableCard
              title="PAYOUT HISTORY"
              showExport
              onExport={() => console.log("Export data")}
            >
              <table className="min-w-full divide-y divide-[#2C2F3C]">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Method</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Transaction</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2F3C]">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-[#A0AFC0]">No payouts found</td>
                    </tr>
                  ) : (
                    payouts.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{p.date}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-[#00E5FF] font-bold">{p.amount.toFixed(2)} {p.currency}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{getStatusBadge(p.status)}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{p.method}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {p.transactionHash ? (
                            <a
                              href={`https://polygonscan.com/tx/${p.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00E5FF] underline hover:text-[#00FFC8] transition"
                            >
                              {p.transactionHash}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{p.notes || "-"}</td>
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
