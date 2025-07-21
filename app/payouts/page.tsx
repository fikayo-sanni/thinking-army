"use client";

import { useState } from "react";
import { ModernSidebar } from "@/components/layout/modern-sidebar";
import { ModernHeader } from "@/components/layout/modern-header";
import { PageHeader } from "@/components/layout/page-header";
import { FilterControls } from "@/components/layout/filter-controls";
import { DataTableCard } from "@/components/ui/data-table-card";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "lucide-react";
import {
  usePayoutsData,
  usePayoutHistory,
  usePayoutStats,
} from "@/hooks/use-payouts";
import { useTimeRange } from "@/hooks/use-time-range";
import { Skeleton } from "@/components/ui/skeleton";
import { formatThousands } from "@/lib/utils";

export default function PayoutsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useTimeRange("this-week");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch payout stats and history
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

  if (isStatsError || isHistoryError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Payouts Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your payouts data right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchStats(); refetchHistory(); }} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Page Title Block */}
        <PageHeader
          title="PAYOUTS"
          description="Manage your withdrawals and payout history"
        />

        {/* Balance Overview Block */}
        {isStatsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-28 w-full dark:bg-[#2C2F3C] rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="TOTAL PAYOUTS"
              value={`${formatThousands(
                statsData?.totalPayouts.toFixed(2) ?? 0
              )}`}
              icon={TrendingUp}
              change={{
                value: `+${statsData?.monthlyGrowth.toFixed(2) ?? 0}%`,
                type: "positive",
              }}
            />
            <MetricCard
              title="TOTAL AMOUNT"
              value={`${formatThousands(
                Math.floor(Number(statsData?.totalAmount)) ?? 0
              )} VP`}
              icon={CheckCircle}
              change={{
                value: `+${statsData?.monthlyGrowth.toFixed(2) ?? 0}%`,
                type: "positive",
              }}
            />
            <MetricCard
              title="PENDING PAYOUTS"
              value={`${formatThousands(
                statsData?.pendingAmount.toFixed(2) ?? 0
              )} VP`}
              icon={Clock}
              change={{ value: "PROCESSING", type: "neutral" }}
            />
          </div>
        )}

        {/* Filter Controls Block */}
        <FilterControls>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4 text-[#A0AFC0]" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48 dark:bg-[#1A1E2D] dark:border-[#2C2F3C] text-white">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
                  <SelectItem
                    value="all-time"
                    className="text-white hover:bg-[#2C2F3C]"
                  >
                    All Time
                  </SelectItem>
                  <SelectItem
                    value="this-week"
                    className="text-white hover:bg-[#2C2F3C]"
                  >
                    This Week
                  </SelectItem>
                  <SelectItem
                    value="this-month"
                    className="text-white hover:bg-[#2C2F3C]"
                  >
                    This Month
                  </SelectItem>
                  <SelectItem
                    value="this-quarter"
                    className="text-white hover:bg-[#2C2F3C]"
                  >
                    This Quarter
                  </SelectItem>
                  <SelectItem
                    value="last-week"
                    className="text-white hover:bg-[#2C2F3C]"
                  >
                    Last Week
                  </SelectItem>
                  <SelectItem
                    value="last-month"
                    className="text-white hover:bg-[#2C2F3C]"
                  >
                    Last Month
                  </SelectItem>
                  <SelectItem
                    value="last-quarter"
                    className="text-white hover:bg-[#2C2F3C]"
                  >
                    Last Quarter
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterControls>

        {/* Payout History Table Block */}
        {isHistoryLoading ? (
          <div className="dark:bg-[#1A1E2D] border dark:border-[#2C2F3C] border-[#E5E7EB] rounded-lg p-0 w-full">
            <div className="px-6 pt-6 pb-2">
              <Skeleton className="h-6 w-48 mb-4 dark:bg-[#2C2F3C]" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y dark:divide-[#2C2F3C]">
                <thead>
                  <tr>
                    {["Date", "Amount", "Status", "Transaction", "Notes"].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase"
                        >
                          <Skeleton className="h-4 w-20 dark:bg-[#2C2F3C]" />
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-[#2C2F3C]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5].map((j) => (
                        <td key={j} className="px-4 py-2 whitespace-nowrap">
                          <Skeleton className="h-6 w-full dark:bg-[#2C2F3C]" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <DataTableCard
            title="PAYOUT HISTORY"
            showExport
            onExport={() => console.log("Export data")}
          >
            <table className="min-w-full divide-y dark:divide-[#2C2F3C]">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">
                    Transaction
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {payouts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 dark:text-[#A0AFC0]"
                    >
                      No payouts found
                    </td>
                  </tr>
                ) : (
                  payouts.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{p.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-[#0846A6] font-bold">
                        {formatThousands(p.amount.toFixed(2))} {p.currency}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {p.transactionHash ? (
                          <a
                            href={`#`}
                            rel="noopener noreferrer"
                            className="text-[#0846A6] underline hover:text-[#00B28C] transition"
                          >
                            {p.transactionHash}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {p.notes || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
              <div className="flex-1 text-[#A0AFC0] text-sm">
                Page {currentPage} of {totalPages} ({historyData?.total || 0}{" "}
                total results)
              </div>
              <div className="flex items-center space-x-4 justify-end">
                {/* Items per page dropdown */}
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(v) => {
                    setItemsPerPage(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-24 dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#2C2F3C] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#2C2F3C]">
                    {[5, 10, 20, 50].map((opt) => (
                      <SelectItem
                        key={opt}
                        value={String(opt)}
                        className="text-white hover:bg-[#2C2F3C]"
                      >
                        {opt} / page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Pagination controls */}
                <button
                  className={`px-4 py-2 rounded-lg dark:bg-[#181B23] border-[#E5E7EB] border dark:border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#0846A6] transition disabled:opacity-50`}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                {/* First page */}
                <button
                  className={`px-3 py-2 rounded-lg border-[#E5E7EB] border text-sm font-medium transition ${
                    currentPage === 1
                      ? "dark:bg-[#0846A6] text-black dark:border-[#0846A6]"
                      : "dark:bg-[#181B23] text-[#A0AFC0] dark:border-[#2C2F3C] dark:hover:text-white dark:hover:border-[#0846A6]"
                  }`}
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
                    className="px-3 py-2 rounded-lg border text-sm font-medium border-[#E5E7EB] dark:bg-[#0846A6] text-black dark:border-[#0846A6]"
                    disabled
                  >
                    {currentPage}
                  </button>
                )}
                {/* Ellipsis if needed */}
                {currentPage < totalPages - 2 && (
                  <span className="text-[#A0AFC0]">...</span>
                )}
                {/* Last page */}
                {totalPages > 1 && (
                  <button
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
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
                <button
                  className={`px-4 py-2 rounded-lg dark:bg-[#181B23] border-[#E5E7EB] border dark:border-[#2C2F3C] text-[#A0AFC0] dark:hover:text-white dark:hover:border-[#0846A6] transition disabled:opacity-50`}
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </DataTableCard>
        )}
      </div>
    </div>
  );
}
