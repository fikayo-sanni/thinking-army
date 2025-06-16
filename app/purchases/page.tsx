"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { DataTableCard } from "@/components/ui/data-table-card"
import { SummaryCard } from "@/components/ui/summary-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Filter } from "lucide-react"

// Mock data for purchases
const purchasesData = [
  {
    id: "1",
    date: "2024-01-15",
    tokenId: "COSMIC WARRIOR #1234",
    amount: 2.5,
    status: "completed",
    source: "OpenSea",
  },
  {
    id: "2",
    date: "2024-01-14",
    tokenId: "DIGITAL DRAGON #5678",
    amount: 1.8,
    status: "completed",
    source: "Rarible",
  },
  {
    id: "3",
    date: "2024-01-13",
    tokenId: "PIXEL ART #9999",
    amount: 3.2,
    status: "pending",
    source: "Foundation",
  },
  {
    id: "4",
    date: "2024-01-12",
    tokenId: "CYBER PUNK #4567",
    amount: 1.5,
    status: "completed",
    source: "SuperRare",
  },
  {
    id: "5",
    date: "2024-01-11",
    tokenId: "ABSTRACT MIND #7890",
    amount: 4.1,
    status: "failed",
    source: "OpenSea",
  },
  {
    id: "6",
    date: "2024-01-10",
    tokenId: "NEON CITY #2345",
    amount: 2.8,
    status: "completed",
    source: "Async Art",
  },
  {
    id: "7",
    date: "2024-01-09",
    tokenId: "SPACE ODYSSEY #6789",
    amount: 5.2,
    status: "completed",
    source: "Foundation",
  },
  {
    id: "8",
    date: "2024-01-08",
    tokenId: "DIGITAL DREAMS #3456",
    amount: 1.9,
    status: "pending",
    source: "Rarible",
  },
]

export default function PurchasesPage() {
  const [timeRange, setTimeRange] = useState("30")
  const [statusFilter, setStatusFilter] = useState("all")

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

  const filteredPurchases = purchasesData.filter((purchase) => {
    if (statusFilter !== "all" && purchase.status !== statusFilter) {
      return false
    }
    return true
  })

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="PURCHASES" description="Track and manage your NFT purchase history" />

          {/* Filter Controls Block */}
          <FilterControls>
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
                  <SelectItem value="failed" className="text-white hover:bg-[#2C2F3C]">
                    Failed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FilterControls>

          {/* Purchases Table Block */}
          <DataTableCard
            title="PURCHASE HISTORY"
            subtitle={`Showing ${filteredPurchases.length} of ${purchasesData.length} purchases`}
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
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">STATUS</TableHead>
                    <TableHead className="text-[#A0AFC0] uppercase text-xs tracking-wider">SOURCE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id} className="border-[#2C2F3C] hover:bg-[#1A1E2D]/30">
                      <TableCell className="text-[#A0AFC0]">
                        {new Date(purchase.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-white font-medium uppercase">{purchase.tokenId}</TableCell>
                      <TableCell className="text-[#00E5FF] font-bold">{purchase.amount} ETH</TableCell>
                      <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                      <TableCell className="text-[#A0AFC0]">{purchase.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPurchases.length === 0 && (
              <div className="text-center py-12">
                <div className="text-[#A0AFC0] text-lg mb-2">No purchases found</div>
                <div className="text-[#A0AFC0] text-sm">Try adjusting your filters to see more results</div>
              </div>
            )}
          </DataTableCard>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              title="TOTAL SPENT"
              value={`${filteredPurchases.reduce((sum, p) => sum + p.amount, 0).toFixed(1)} ETH`}
              color="text-[#00E5FF]"
            />
            <SummaryCard title="TOTAL PURCHASES" value={filteredPurchases.length} color="text-[#00FFC8]" />
            <SummaryCard
              title="SUCCESS RATE"
              value={`${((filteredPurchases.filter((p) => p.status === "completed").length / filteredPurchases.length) * 100).toFixed(0)}%`}
              color="text-[#6F00FF]"
            />
          </div>
        </div>
      </div>
    </ModernSidebar>
  )
}
