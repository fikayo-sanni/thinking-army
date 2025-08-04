"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { FilterControls } from "@/components/layout/filter-controls";
import { DataTableCard } from "@/components/ui/data-table-card";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PayoutRequestModal } from "@/components/payouts/payout-request-modal";
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
  AlertTriangle,
  Plus,
} from "lucide-react";
import {
  usePayoutHistory,
  usePayoutStats,
  usePendingPayouts,
} from "@/hooks/use-payouts";
import { useTimeRange } from "@/hooks/use-time-range";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PayoutsStatsSkeleton,
  PayoutsTableSkeleton,
  PayoutsPendingSkeleton,
} from "@/components/payouts/payouts-skeletons";
import { formatThousands } from "@/lib/utils";
import { MobileTable } from "@/components/ui/mobile-table";
import { MobileFilterControls } from "@/components/layout/mobile-filter-controls";
import { useSetPageTitle } from "@/hooks/use-page-title";

export default function PayoutsPage() {
  // Set page title
  useSetPageTitle("Payouts");

  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useTimeRange("this-week");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🚀 OPTIMIZED: Individual hooks for parallel loading
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = usePayoutStats(timeRange);
  
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = usePayoutHistory(
    { timeRange, status: statusFilter !== "all" ? statusFilter : undefined },
    currentPage,
    itemsPerPage
  );

  // ✨ Pending payouts
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    isError: isPendingError,
    refetch: refetchPending,
  } = usePendingPayouts();

  const payouts = historyData?.payouts || [];
  const totalPages = historyData?.totalPages || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            COMPLETED
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            PENDING
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            PROCESSING
          </Badge>
        );
      case "failed":
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            FAILED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-[#2C2F3C] text-[#A0AFC0]">
            {status.toUpperCase()}
          </Badge>
        );
    }
  };

  const getMethodIcon = (method: string) => {
    return method.includes("Wallet") ? (
      <Wallet className="h-4 w-4 text-[#0846A6]" />
    ) : (
      <CreditCard className="h-4 w-4 text-[#00B28C]" />
    );
  };

  const handlePayoutRequest = (
    amount: number,
    method: string,
    address: string
  ) => {
    console.log("Payout request:", { amount, method, address });
    // Handle payout request logic here
  };

  // Check if any critical data failed to load
  const hasCriticalError = isStatsError || isHistoryError;

  if (hasCriticalError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Payouts Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your payouts data right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchStats(); refetchHistory(); refetchPending(); }} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Page Title Block */}
        <PageHeader
          title="PAYOUTS"
          description="Manage your withdrawals and payout history"
        />

        {/* Balance Overview Block - Mobile-optimized grid */}
        {isStatsLoading ? (
          <PayoutsStatsSkeleton />
        ) : statsData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#0846A6]/10">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#0846A6]" />
                  </div>
                  <Badge className={
                    (statsData.totalPayoutsChange ?? 0) >= 0 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {`${(statsData.totalPayoutsChange?? 0) >= 0 ? '+' : ''}${statsData.totalPayoutsChange?.toFixed(2) ?? 0}%`}
                  </Badge>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white mobile-text-lg">
                  {formatThousands(statsData.totalPayouts ?? 0)}
                </div>
                <div className="text-[#A0AFC0] text-xs sm:text-sm uppercase tracking-wider mobile-text-sm">TOTAL PAYOUTS</div>
              </CardContent>
            </Card>

            <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#00B28C]/10">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#00B28C]" />
                  </div>
                  <Badge className={
                    (statsData.totalAmountChange ?? 0) >= 0 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {`${(statsData.totalAmountChange ?? 0) >= 0 ? '+' : ''}${(statsData.totalAmountChange ?? 0).toFixed(2)}%`}
                  </Badge>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white mobile-text-lg">
                  {formatThousands(Math.floor(Number(statsData.totalAmount)) ?? 0)} VP
                </div>
                <div className="text-[#A0AFC0] text-xs sm:text-sm uppercase tracking-wider mobile-text-sm">TOTAL AMOUNT</div>
              </CardContent>
            </Card>

            <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#FF6B00]/10">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF6B00]" />
                  </div>
                  <Badge className="bg-[#FF6B00]/20 text-[#FF6B00] border-[#FF6B00]/30">PROCESSING</Badge>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white mobile-text-lg">
                  {formatThousands(statsData.pendingAmount?.toFixed(2) ?? 0)} VP
                </div>
                <div className="text-[#A0AFC0] text-xs sm:text-sm uppercase tracking-wider mobile-text-sm">PENDING PAYOUTS</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-[#A0AFC0] text-center py-8">No payout statistics available.</div>
        )}

        {/* Filter Controls Block */}
        <MobileFilterControls title="Payout Filters">
          <div className="flex items-center space-x-2 md:space-x-2">
            <CalendarDays className="h-4 w-4 text-[#A0AFC0] hidden md:block" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full md:w-48 h-12 md:h-auto dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                <SelectValue placeholder="Select time range" />
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

          <div className="flex items-center space-x-2 md:space-x-2">
            <Filter className="h-4 w-4 text-[#A0AFC0] hidden md:block" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 md:h-auto dark:bg-[#1A1E2D] dark:border-[#E5E7EB] text-white">
                <SelectValue placeholder="Status filter" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-none">
                <SelectItem value="all" className="text-white hover:bg-[#E5E7EB]">
                  All Status
                </SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-[#E5E7EB]">
                  Completed
                </SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-[#E5E7EB]">
                  Pending
                </SelectItem>
                <SelectItem value="processing" className="text-white hover:bg-[#E5E7EB]">
                  Processing
                </SelectItem>
                <SelectItem value="failed" className="text-white hover:bg-[#E5E7EB]">
                  Failed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </MobileFilterControls>

        {/* ✨ Pending Payouts Section - Load independently */}
        {isPendingLoading ? (
          <PayoutsPendingSkeleton />
        ) : (pendingData && pendingData.length > 0) ? (
          <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#0846A6]" />
                  <span>PENDING PAYOUTS</span>
                </div>
                <Button size="sm" className="bg-[#0846A6] hover:bg-[#06377a]">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingData.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-3 border border-[#2C2F3C] rounded-lg">
                  <div className="space-y-1">
                    <div className="text-white font-medium">{formatThousands(payout.amount)} {payout.currency}</div>
                    <div className="text-[#A0AFC0] text-sm">{payout.method} • Expected: {payout.expectedDate}</div>
                  </div>
                  {getStatusBadge(payout.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : isPendingError ? (
          <div className="text-red-500 text-center py-8">Failed to load pending payouts.</div>
        ) : null}

        {/* Payout History Table Block - Load independently */}
        {isHistoryLoading ? (
          <PayoutsTableSkeleton />
        ) : (
          <DataTableCard
            title="PAYOUT HISTORY"
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
                  key: 'amount',
                  header: 'Amount',
                  render: (value, row) => (
                    <span className="text-[#0846A6] font-bold">
                      {formatThousands(value.toFixed(2))} {row.currency}
                    </span>
                  )
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (value) => getStatusBadge(value)
                },
                {
                  key: 'transactionHash',
                  header: 'Transaction',
                  mobileLabel: 'Tx',
                  render: (value) => value ? (
                    <a
                      href={`#`}
                      rel="noopener noreferrer"
                      className="text-[#0846A6] underline hover:text-[#00B28C] transition"
                    >
                      {value}
                    </a>
                  ) : "-"
                },
                {
                  key: 'notes',
                  header: 'Notes',
                  mobileLabel: 'Notes',
                  render: (value) => value || "-"
                }
              ]}
              data={payouts}
              keyField="id"
              emptyMessage={isHistoryError ? "Failed to load payout history." : "No payouts found"}
            />
            
            {/* Pagination - only show if not error and has data */}
            {!isHistoryError && payouts.length > 0 && (
              <div className="mt-4 space-y-4">
                {/* Mobile Stats */}
                <div className="text-center md:hidden">
                  <div className="text-[#A0AFC0] text-sm">
                    Page {formatThousands(currentPage)} of {formatThousands(totalPages)}
                  </div>
                  <div className="text-[#A0AFC0] text-xs">
                    {formatThousands(historyData?.total || 0)} total results
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Desktop Stats */}
                  <div className="hidden md:block flex-1 text-[#A0AFC0] text-sm">
                    Page {formatThousands(currentPage)} of {formatThousands(totalPages)} ({formatThousands(historyData?.total || 0)} total results)
                  </div>

                  {/* Items per page - Full width on mobile */}
                  <div className="w-full md:w-auto">
                    <Select
                      value={String(itemsPerPage)}
                      onValueChange={(v) => {
                        setItemsPerPage(Number(v));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full md:w-32 h-12 md:h-auto dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] border-none">
                        {[5, 10, 20, 50].map((opt) => (
                          <SelectItem
                            key={opt}
                            value={String(opt)}
                            className="text-white hover:bg-[#E5E7EB]"
                          >
                            {opt} / page
                          </SelectItem>
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
                        className={`px-3 py-2 rounded-lg border-[#E5E7EB] text-sm font-medium transition min-h-[44px] md:min-h-0 ${
                          currentPage === 1
                            ? "dark:bg-[#0846A6] text-black dark:border-[#0846A6]"
                            : "dark:bg-[#181B23] text-[#A0AFC0] dark:border-[#E5E7EB] hover:text-white dark:hover:border-[#0846A6]"
                        }`}
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        1
                      </button>
                      {currentPage > 3 && <span className="text-[#A0AFC0]">...</span>}
                      {currentPage !== 1 && currentPage !== totalPages && (
                        <button
                          className="px-3 py-2 rounded-lg border text-sm font-medium border-[#E5E7EB] dark:bg-[#0846A6] text-black dark:border-[#0846A6] min-h-[44px] md:min-h-0"
                          disabled
                        >
                          {currentPage}
                        </button>
                      )}
                      {currentPage < totalPages - 2 && (
                        <span className="text-[#A0AFC0]">...</span>
                      )}
                      {totalPages > 1 && (
                        <button
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition min-h-[44px] md:min-h-0 ${
                            currentPage === totalPages
                              ? "dark:bg-[#0846A6] text-black border-[#E5E7EB] dark:border-[#0846A6]"
                              : "dark:bg-[#181B23] text-[#A0AFC0] border-[#E5E7EB] dark:border-[#2C2F3C] dark:hover:text-white dark:hover:border-[#0846A6]"
                          }`}
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>

                    <button
                      className="flex-1 md:flex-none px-4 py-3 md:py-2 rounded-lg dark:bg-[#181B23] border-[#E5E7EB] border dark:border-[#2C2F3C] text-[#A0AFC0] dark:hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50 min-h-[44px] md:min-h-0"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
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
  );
}
