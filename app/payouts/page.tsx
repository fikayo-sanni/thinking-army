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
import { formatThousands, safeFormatDate } from "@/lib/utils";
import { MobileTable } from "@/components/ui/mobile-table";
import { MobileFilterControls } from "@/components/layout/mobile-filter-controls";
import { useSetPageTitle } from "@/hooks/use-page-title";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Add card styles
const cardStyles = {
  base: "bg-white  border border-[#E4E6EB] dark:border-[#2A2A2A] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:border-[#DADCE0] dark:hover:border-[#3A3A3A] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
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
  const totalItems = historyData?.total || 0;

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
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-semibold text-[#202124] dark:text-[#E6E6E6]">
            Payouts
          </h1>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-9 bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] w-48">
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
      <div className="flex gap-6 min-h-[calc(100vh-theme(spacing.32))]">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6 min-w-0"> {/* Added min-w-0 to prevent flex child from overflowing */}
          {/* Summary Stats */}
          {isStatsLoading ? (
            <PayoutsStatsSkeleton />
          ) : statsData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <TrendingUp className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Total Payouts</h3>
                      <p className={cardStyles.subtitle}>All time payouts</p>
                    </div>
                  </div>
                  <Badge className={
                    (statsData.totalPayoutsChange ?? 0) >= 0 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {`${(statsData.totalPayoutsChange ?? 0) >= 0 ? '+' : ''}${statsData.totalPayoutsChange?.toFixed(2) ?? 0}%`}
                  </Badge>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {formatThousands(statsData.totalPayouts ?? 0)}
                      </div>
                      <div className={cardStyles.metric.label}>
                        Total Payouts
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <CheckCircle className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Total Amount</h3>
                      <p className={cardStyles.subtitle}>Total value paid out</p>
                    </div>
                  </div>
                  <Badge className={
                    (statsData.totalAmountChange ?? 0) >= 0 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {`${(statsData.totalAmountChange ?? 0) >= 0 ? '+' : ''}${(statsData.totalAmountChange ?? 0).toFixed(2)}%`}
                  </Badge>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {formatThousands(Math.floor(Number(statsData.totalAmount)) ?? 0)} VP
                      </div>
                      <div className={cardStyles.metric.label}>
                        Total Amount
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <Clock className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Pending</h3>
                      <p className={cardStyles.subtitle}>Processing payouts</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {formatThousands(statsData.pendingAmount?.toFixed(2) ?? 0)} VP
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
            <div className="text-[#5F6368] dark:text-[#A0A0A0] text-center py-8">No payout statistics available.</div>
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
                  <p className={cardStyles.subtitle}>Refine payout view</p>
                </div>
              </div>
            </div>
            <div className={cardStyles.content}>
              <div className="flex flex-wrap gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] w-48">
                    <SelectValue placeholder="Status filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Payout History */}
          {isHistoryLoading ? (
            <PayoutsTableSkeleton />
          ) : (
            <div className={cardStyles.base}>
              <div className={cardStyles.header}>
                <div className={cardStyles.headerLeft}>
                  <div className={cardStyles.iconContainer}>
                    <TrendingUp className={cardStyles.icon} />
                  </div>
                  <div>
                    <h3 className={cardStyles.title}>Payout History</h3>
                    <p className={cardStyles.subtitle}>
                      Showing {formatThousands(payouts.length)} of {formatThousands(historyData?.total || 0)} payouts
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${cardStyles.content} overflow-x-auto`}> {/* Added overflow-x-auto */}
                <div className="min-w-[640px]"> {/* Added minimum width for mobile */}
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F8F9FB] dark:bg-[#1A2B45] hover:bg-[#F8F9FB] dark:hover:bg-[#1A2B45]">
                        <TableHead className="w-[120px] font-medium">Date</TableHead>
                        <TableHead className="font-medium">Amount</TableHead>
                        <TableHead className="font-medium">Currency</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Description</TableHead>
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
                            <TableCell>
                              <Skeleton className="h-4 w-40 bg-[#F8F9FB] dark:bg-[#2C2F3C]" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : payouts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center text-[#5F6368] dark:text-[#A0A0A0]">
                              <Wallet className="h-8 w-8 mb-2 opacity-50" />
                              <p className="text-sm">No payouts found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        payouts.map((payout) => (
                          <TableRow key={payout.id}>
                            <TableCell className="font-medium">
                              {safeFormatDate(payout.date)}
                            </TableCell>
                            <TableCell>{formatThousands(payout.amount)}</TableCell>
                            <TableCell>{payout.currency}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  payout.status === 'completed' ? 'success' :
                                  payout.status === 'pending' ? 'warning' :
                                  payout.status === 'failed' ? 'destructive' : 'secondary'
                                }
                                className="capitalize"
                              >
                                {payout.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {payout.transactionHash ? (
                                <a 
                                  href={`https://etherscan.io/tx/${payout.transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#297EFF] dark:text-[#4D8DFF] hover:underline"
                                >
                                  {payout.transactionHash.slice(0, 25)}...{payout.transactionHash.slice(-8)}
                                </a>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Pagination */}
              <div className="m-4 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
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
          )}
        </div>

        {/* Right Details Panel */}
        <div className="hidden xl:block w-[340px] flex-shrink-0 bg-white  border-l border-[#E4E6EB] dark:border-[#2A2A2A]">
          <div className="sticky top-0 p-6 space-y-6">
            {/* Quick Stats Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Total Payouts</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-16 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      formatThousands(statsData?.totalPayouts ?? 0)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Total Amount</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      `${formatThousands(Math.floor(Number(statsData?.totalAmount)) ?? 0)} VP`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Pending Amount</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      `${formatThousands(statsData?.pendingAmount?.toFixed(2) ?? 0)} VP`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Payouts Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Pending Payouts
              </h3>
              <div className="space-y-4">
                {isPendingLoading ? (
                  <Skeleton className="h-20 w-full dark:bg-[#2C2F3C] rounded" />
                ) : pendingData && pendingData.length > 0 ? (
                  pendingData.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-[#297EFF]/10">
                        <Clock className="h-4 w-4 text-[#297EFF]" />
                      </div>
                      <div>
                        <p className="text-[14px] text-[#202124] dark:text-[#E6E6E6]">
                          {formatThousands(payout.amount)} {payout.currency}
                        </p>
                        <span className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">
                          {payout.method} • Expected: {payout.expectedDate}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0] text-center">
                    No pending payouts
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
