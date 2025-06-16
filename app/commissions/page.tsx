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
import { CalendarDays, Filter, TrendingUp, Clock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for commissions
const commissionsData = [
  {
    id: "1",
    date: "2024-01-15",
    sourceUser: "EMMA WILSON",
    sourceUserId: "emmaw",
    type: "C1",
    amount: 0.25,
    status: "paid",
    transactionId: "0x1a2b3c4d5e6f7890",
  },
  {
    id: "2",
    date: "2024-01-14",
    sourceUser: "DAVID MILLER",
    sourceUserId: "dmiller",
    type: "C2",
    amount: 0.15,
    status: "paid",
    transactionId: "0x2b3c4d5e6f789012",
  },
  {
    id: "3",
    date: "2024-01-13",
    sourceUser: "JAMES BROWN",
    sourceUserId: "jbrown",
    type: "C1",
    amount: 0.3,
    status: "pending",
    transactionId: "0x3c4d5e6f78901234",
  },
  {
    id: "4",
    date: "2024-01-12",
    sourceUser: "LISA GARCIA",
    sourceUserId: "lisag",
    type: "C3",
    amount: 0.08,
    status: "paid",
    transactionId: "0x4d5e6f7890123456",
  },
  {
    id: "5",
    date: "2024-01-11",
    sourceUser: "SOPHIA DAVIS",
    sourceUserId: "sophiad",
    type: "C1",
    amount: 0.22,
    status: "pending",
    transactionId: "0x5e6f789012345678",
  },
  {
    id: "6",
    date: "2024-01-10",
    sourceUser: "RYAN TAYLOR",
    sourceUserId: "rtaylor",
    type: "C2",
    amount: 0.18,
    status: "paid",
    transactionId: "0x6f78901234567890",
  },
  {
    id: "7",
    date: "2024-01-09",
    sourceUser: "EMMA WILSON",
    sourceUserId: "emmaw",
    type: "C1",
    amount: 0.35,
    status: "paid",
    transactionId: "0x789012345678901a",
  },
  {
    id: "8",
    date: "2024-01-08",
    sourceUser: "MICHAEL CHEN",
    sourceUserId: "mchen",
    type: "C3",
    amount: 0.12,
    status: "processing",
    transactionId: "0x89012345678901ab",
  },
  {
    id: "9",
    date: "2024-01-07",
    sourceUser: "DAVID MILLER",
    sourceUserId: "dmiller",
    type: "C2",
    amount: 0.2,
    status: "paid",
    transactionId: "0x9012345678901abc",
  },
  {
    id: "10",
    date: "2024-01-06",
    sourceUser: "SARAH JOHNSON",
    sourceUserId: "sarahj",
    type: "C1",
    amount: 0.28,
    status: "paid",
    transactionId: "0xa012345678901bcd",
  },
]

export default function CommissionsPage() {
  const [typeFilter, setTypeFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("30")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

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

  const getTypeBadge = (type: string) => {
    const colors = {
      C1: "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30",
      C2: "bg-[#00FFC8]/20 text-[#00FFC8] border-[#00FFC8]/30",
      C3: "bg-[#6F00FF]/20 text-[#6F00FF] border-[#6F00FF]/30",
    }
    return <Badge className={colors[type as keyof typeof colors] || "bg-[#2C2F3C] text-[#A0AFC0]"}>{type}</Badge>
  }

  const filteredCommissions = commissionsData.filter((commission) => {
    if (typeFilter !== "all" && commission.type !== typeFilter) return false
    if (statusFilter !== "all" && commission.status !== statusFilter) return false
    return true
  })

  // Calculate summary stats
  const totalEarned = commissionsData.reduce((sum, c) => sum + c.amount, 0)
  const c1Total = commissionsData.filter((c) => c.type === "C1").reduce((sum, c) => sum + c.amount, 0)
  const c2Total = commissionsData.filter((c) => c.type === "C2").reduce((sum, c) => sum + c.amount, 0)
  const c3Total = commissionsData.filter((c) => c.type === "C3").reduce((sum, c) => sum + c.amount, 0)
  const pendingTotal = commissionsData.filter((c) => c.status === "pending").reduce((sum, c) => sum + c.amount, 0)
  const withdrawnTotal = commissionsData.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0)

  // Pagination
  const totalPages = Math.ceil(filteredCommissions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCommissions = filteredCommissions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="COMMISSIONS" description="Track your earnings and commission breakdown" />

          {/* Summary Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="TOTAL EARNED"
              value={`${totalEarned.toFixed(2)} ETH`}
              icon={TrendingUp}
              change={{ value: "+12%", type: "positive" }}
            />
            {/* Keep the existing commission types card as is */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="text-lg font-bold text-white mb-2">COMMISSION TYPES</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[#00E5FF] text-sm">C1 (Direct)</span>
                      <span className="text-white font-medium">{c1Total.toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#00FFC8] text-sm">C2 (Level 2)</span>
                      <span className="text-white font-medium">{c2Total.toFixed(2)} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6F00FF] text-sm">C3 (Level 3)</span>
                      <span className="text-white font-medium">{c3Total.toFixed(2)} ETH</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <MetricCard title="PENDING" value={`${pendingTotal.toFixed(2)} ETH`} icon={Clock} />
            <MetricCard title="WITHDRAWN" value={`${withdrawnTotal.toFixed(2)} ETH`} icon={CheckCircle} />
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
                <CalendarDays className="h-4 w-4 text-[#A0AFC0]" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                    <SelectValue placeholder="Time range" />
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

          {/* Commissions Table Block */}
          <DataTableCard
            title="COMMISSION HISTORY"
            subtitle={`Showing ${paginatedCommissions.length} of ${filteredCommissions.length} commissions`}
            showExport
            onExport={() => console.log("Export data")}
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2C2F3C] hover:bg-[#1A1E2D]/30">
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">DATE</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">SOURCE USER</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">TYPE</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">AMOUNT</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">STATUS</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">TRANSACTION ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCommissions.map((commission) => (
                    <TableRow key={commission.id} className="border-[#2C2F3C] hover:bg-[#1A1E2D]/30">
                      <TableCell className="text-[#A0AFC0]">
                        {new Date(commission.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-white font-medium uppercase text-sm">{commission.sourceUser}</div>
                          <div className="text-[#A0AFC0] text-xs font-mono">@{commission.sourceUserId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(commission.type)}</TableCell>
                      <TableCell className="text-[#00E5FF] font-bold">{commission.amount.toFixed(2)} ETH</TableCell>
                      <TableCell>{getStatusBadge(commission.status)}</TableCell>
                      <TableCell>
                        <div
                          className="font-mono text-xs text-[#A0AFC0] max-w-32 truncate"
                          title={commission.transactionId}
                        >
                          {commission.transactionId}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredCommissions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-[#A0AFC0] text-lg mb-2">No commissions found</div>
                <div className="text-[#A0AFC0] text-sm">Try adjusting your filters to see more results</div>
              </div>
            )}
          </DataTableCard>

          {/* Pagination Block */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-[#A0AFC0] text-sm">
                Page {currentPage} of {totalPages} ({filteredCommissions.length} total results)
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
