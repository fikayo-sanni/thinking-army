"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { DataTableCard } from "@/components/ui/data-table-card"
import { SummaryCard } from "@/components/ui/summary-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Filter } from "lucide-react"
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

const chartConfig = {
  purchases: {
    label: "Purchases",
    color: "#00E5FF",
  },
  volume: {
    label: "Volume (USDC)",
    color: "#00FFC8",
  },
}

export default function PurchasesPage() {
  const [timeRange, setTimeRange] = useState("last-month")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch data using custom hooks
  const { data: purchasesData, isLoading: isDataLoading, error: dataError } = usePurchasesData(timeRange)
  const { data: historyData, isLoading: isHistoryLoading, error: historyError } = usePurchaseHistory(
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
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6 space-y-6">
            <PageHeader title="NETWORK ACTIVITY" description="Tracking my network's activity" />
            
            {/* Loading skeleton for summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-6">
                  <Skeleton className="h-4 w-24 mb-2 bg-[#2C2F3C]" />
                  <Skeleton className="h-8 w-32 bg-[#2C2F3C]" />
                </div>
              ))}
            </div>

            {/* Loading skeleton for chart */}
            <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-4 bg-[#2C2F3C]" />
              <Skeleton className="h-64 w-full bg-[#2C2F3C]" />
            </div>

            {/* Loading skeleton for table */}
            <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-4 bg-[#2C2F3C]" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-[#2C2F3C]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ModernSidebar>
    )
  }

  // Error states
  if (dataError || historyError) {
    return (
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-red-400 text-lg mb-2">Error loading data</div>
              <div className="text-[#A0AFC0] text-sm">Please try refreshing the page</div>
            </div>
          </div>
        </div>
      </ModernSidebar>
    )
  }

  const purchases = historyData?.purchases || []
  const overview = purchasesData?.overview
  const chartData = purchasesData?.chartData || []
  const totalPages = historyData?.totalPages || 1;

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="NETWORK PURCHASES" description="Track and manage your NFT purchase history" />

          {/* Summary Stats - Moved to top for better hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              title="TOTAL VOLUME POINTS IN PERIOD"
              value={`${overview?.totalSpent.toFixed(1) || '0.0'} ${overview?.currency || 'VP'}`}
              color="text-[#00E5FF]"
            />
            <SummaryCard 
              title="TOTAL PURCHASES" 
              value={overview?.totalPurchases || 0} 
              color="text-[#00FFC8]" 
            />
          </div>

          {/* Filter Controls Block */}
          <FilterControls>
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
          </FilterControls>

          {/* Network Purchases Over Time Chart */}
          <div style={{ width: "70%", transform: "scale(0.9)", transformOrigin: "top left" }} className="mb-4">
            <ChartCard title="NETWORK PURCHASES OVER TIME" description="Daily purchase activity and volume trends">
              <ChartContainer config={chartConfig}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2F3C" />
                  <XAxis
                    dataKey="date"
                    stroke="#A0AFC0"
                    tick={{ fill: "#A0AFC0", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#A0AFC0"
                    tick={{ fill: "#A0AFC0", fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#A0AFC0"
                    tick={{ fill: "#A0AFC0", fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-3 shadow-lg">
                            <div className="text-white font-medium mb-2">{label}</div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-[#00E5FF]">Purchases:</span>
                                <span className="text-white font-medium">{payload[0]?.value}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#00FFC8]">Volume:</span>
                                <span className="text-white font-medium">{payload[1]?.value} VP</span>
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
                    stroke="#00E5FF"
                    strokeWidth={1.5}
                    dot={{ fill: "#00E5FF", strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: "#00E5FF", strokeWidth: 1 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="volume"
                    stroke="#00FFC8"
                    strokeWidth={1.5}
                    dot={{ fill: "#00FFC8", strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: "#00FFC8", strokeWidth: 1 }}
                  />
                </LineChart>
              </ChartContainer>
            </ChartCard>
          </div>

          {/* Purchases Table Block */}
          <DataTableCard
            title="NETWORK ACTIVITY HISTORY"
            subtitle={`Showing ${purchases.length} of ${historyData?.total || 0} purchases`}
            showExport
            onExport={() => console.log("Export data")}
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2C2F3C] hover:bg-[#1A1E2D]/30">
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">DATE</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">TOKEN ID</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">AMOUNT</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">BUYER</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id} className="border-[#2C2F3C] hover:bg-[#1A1E2D]/30">
                      <TableCell className="text-[#A0AFC0]">
                        {new Date(purchase.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-white font-medium uppercase">{purchase.tokenId}</TableCell>
                      <TableCell className="text-[#00E5FF] font-bold">{purchase.amount.toFixed(2)} {purchase.currency}</TableCell>
                      <TableCell className="text-[#A0AFC0]">{purchase.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {purchases.length === 0 && (
              <div className="text-center py-12">
                <div className="text-[#A0AFC0] text-lg mb-2">No purchases found</div>
                <div className="text-[#A0AFC0] text-sm">Try adjusting your filters to see more results</div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex-1 text-[#A0AFC0] text-sm">
                Page {currentPage} of {totalPages} ({historyData?.total || 0} total results)
              </div>
              <div className="flex items-center space-x-4 justify-end">
                {/* Items per page dropdown */}
                <Select value={String(itemsPerPage)} onValueChange={v => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-24 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
                    {[5, 10, 20, 50].map(opt => (
                      <SelectItem key={opt} value={String(opt)} className="text-white hover:bg-[#2C2F3C]">{opt} / page</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Pagination controls */}
                <button
                  className={`px-4 py-2 rounded-lg bg-[#181B23] border border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF] transition disabled:opacity-50`}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                {/* First page */}
                <button
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${currentPage === 1 ? 'bg-[#00E5FF] text-black border-[#00E5FF]' : 'bg-[#181B23] text-[#A0AFC0] border-[#2C2F3C] hover:text-white hover:border-[#00E5FF]'}`}
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
                    className="px-3 py-2 rounded-lg border text-sm font-medium bg-[#00E5FF] text-black border-[#00E5FF]"
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
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${currentPage === totalPages ? 'bg-[#00E5FF] text-black border-[#00E5FF]' : 'bg-[#181B23] text-[#A0AFC0] border-[#2C2F3C] hover:text-white hover:border-[#00E5FF]'}`}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    {totalPages}
                  </button>
                )}
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
        </div>
      </div>
    </ModernSidebar>
  )
}
