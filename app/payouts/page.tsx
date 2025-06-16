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

// Mock data for payouts
const payoutsData = [
  {
    id: "1",
    date: "2024-01-15",
    amount: 5.25,
    status: "completed",
    method: "Ethereum Wallet",
    methodDetails: "0x1a2b...7890",
    transactionId: "0x1a2b3c4d5e6f7890abcd",
    processingTime: "2 hours",
  },
  {
    id: "2",
    date: "2024-01-10",
    amount: 3.8,
    status: "completed",
    method: "Bank Transfer",
    methodDetails: "****1234",
    transactionId: "TXN-2024-001234",
    processingTime: "3 days",
  },
  {
    id: "3",
    date: "2024-01-08",
    amount: 2.15,
    status: "pending",
    method: "Ethereum Wallet",
    methodDetails: "0x3c4d...1234",
    transactionId: "PENDING-001",
    processingTime: "Processing",
  },
  {
    id: "4",
    date: "2024-01-05",
    amount: 4.7,
    status: "completed",
    method: "Ethereum Wallet",
    methodDetails: "0x5e6f...5678",
    transactionId: "0x5e6f789012345678abcd",
    processingTime: "1 hour",
  },
  {
    id: "5",
    date: "2024-01-02",
    amount: 1.95,
    status: "failed",
    method: "Bank Transfer",
    methodDetails: "****5678",
    transactionId: "FAILED-001",
    processingTime: "Failed",
  },
  {
    id: "6",
    date: "2023-12-28",
    amount: 6.3,
    status: "completed",
    method: "Ethereum Wallet",
    methodDetails: "0x7890...9012",
    transactionId: "0x789012345678901234ef",
    processingTime: "45 minutes",
  },
  {
    id: "7",
    date: "2023-12-25",
    amount: 2.85,
    status: "processing",
    method: "Bank Transfer",
    methodDetails: "****9012",
    transactionId: "PROC-2023-005",
    processingTime: "1-3 days",
  },
  {
    id: "8",
    date: "2023-12-20",
    amount: 3.45,
    status: "completed",
    method: "Ethereum Wallet",
    methodDetails: "0x9012...3456",
    transactionId: "0x901234567890123456gh",
    processingTime: "1.5 hours",
  },
]

export default function PayoutsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("30")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Mock balance data
  const balanceData = {
    totalEarnings: 45.7,
    availableBalance: 8.25,
    pendingPayouts: 2.15,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">COMPLETED</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">PENDING</Badge>
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">PROCESSING</Badge>
      case "failed":
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

  const filteredPayouts = payoutsData.filter((payout) => {
    if (statusFilter !== "all" && payout.status !== statusFilter) return false
    return true
  })

  // Pagination
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPayouts = filteredPayouts.slice(startIndex, startIndex + itemsPerPage)

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="TOTAL EARNINGS"
              value={`${balanceData.totalEarnings.toFixed(2)} ETH`}
              icon={TrendingUp}
              change={{ value: "LIFETIME", type: "neutral" }}
            />
            <MetricCard
              title="AVAILABLE BALANCE"
              value={`${balanceData.availableBalance.toFixed(2)} ETH`}
              icon={CheckCircle}
              change={{ value: "READY", type: "positive" }}
            />
            <MetricCard
              title="PENDING PAYOUTS"
              value={`${balanceData.pendingPayouts.toFixed(2)} ETH`}
              icon={Clock}
              change={{ value: "PROCESSING", type: "neutral" }}
            />
          </div>

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
                    availableBalance={balanceData.availableBalance}
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
                    <SelectItem value="7" className="text-white hover:bg-[#2C2F3C]">
                      Last 7 days
                    </SelectItem>
                    <SelectItem value="30" className="text-white hover:bg-[#2C2F3C]">
                      Last 30 days
                    </SelectItem>
                    <SelectItem value="90" className="text-white hover:bg-[#2C2F3C]">
                      Last 90 days
                    </SelectItem>
                    <SelectItem value="365" className="text-white hover:bg-[#2C2F3C]">
                      Last year
                    </SelectItem>
                    <SelectItem value="all" className="text-white hover:bg-[#2C2F3C]">
                      All time
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FilterControls>

          {/* Payout History Table Block */}
          <DataTableCard>
            <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white uppercase tracking-wide text-xl">PAYOUT HISTORY</CardTitle>
                    <p className="text-[#A0AFC0] text-sm mt-1">
                      Showing {paginatedPayouts.length} of {filteredPayouts.length} payouts
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#2C2F3C] hover:bg-[#1A1E2D]/30">
                        <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">DATE</TableHead>
                        <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">AMOUNT</TableHead>
                        <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">STATUS</TableHead>
                        <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">METHOD</TableHead>
                        <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                          TRANSACTION ID
                        </TableHead>
                        <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                          PROCESSING TIME
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPayouts.map((payout) => (
                        <TableRow key={payout.id} className="border-[#2C2F3C] hover:bg-[#1A1E2D]/30">
                          <TableCell className="text-[#A0AFC0]">
                            {new Date(payout.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-[#00E5FF] font-bold">{payout.amount.toFixed(2)} ETH</TableCell>
                          <TableCell>{getStatusBadge(payout.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getMethodIcon(payout.method)}
                              <div>
                                <div className="text-white text-sm">{payout.method}</div>
                                <div className="text-[#A0AFC0] text-xs font-mono">{payout.methodDetails}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className="font-mono text-xs text-[#A0AFC0] max-w-32 truncate"
                              title={payout.transactionId}
                            >
                              {payout.transactionId}
                            </div>
                          </TableCell>
                          <TableCell className="text-[#A0AFC0] text-sm">{payout.processingTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredPayouts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-[#A0AFC0] text-lg mb-2">No payouts found</div>
                    <div className="text-[#A0AFC0] text-sm">Try adjusting your filters to see more results</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </DataTableCard>

          {/* Pagination Block */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-[#A0AFC0] text-sm">
                Page {currentPage} of {totalPages} ({filteredPayouts.length} total results)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF] disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
                            : "border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF]"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF] disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModernSidebar>
  )
}
