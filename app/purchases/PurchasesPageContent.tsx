'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Filter, AlertTriangle, BarChart3, Calendar } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { usePurchaseOverview, usePurchaseChartData, usePurchaseHistory } from "@/hooks";
import { useTimeRange } from "@/hooks/use-time-range";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PurchasesSummaryCardsSkeleton,
  PurchasesChartSkeleton,
  PurchasesTableSkeleton
} from "@/components/purchases/purchases-skeletons";
import { formatThousands, formatShortNumber, groupChartData, formatXAxisLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobileTable } from "@/components/ui/mobile-table";
import { useSetPageTitle } from "@/hooks/use-page-title";

// Add type definitions
interface Overview {
  totalSpent: number;
  totalPurchases: number;
  currency?: string;
}

interface Purchase {
  id: string;
  date: string;
  tokenId: string;
  category: string;
  amount: number;
  currency: string;
  source: string;
  level: number;
}

const categoryNames: Record<string, string> = {
  '1': 'Star',
  '2': 'SuperStar',
  '3': 'GensisStar',
  '20': 'SupraStar',
  '90': 'PowerStar',
  '91': 'PowerStar',
  '92': 'PowerStar',
  '93': 'PowerStar',
  '94': 'PowerStar',
};

const chartConfig = {
  purchases: {
    label: "Purchases",
    color: "hsl(var(--primary))",
  },
  volume: {
    label: "Volume (USDC)",
    color: "hsl(var(--success))",
  },
};

export function PurchasesPageContent() {
  // Set page title
  useSetPageTitle("Network Activity");

  const [timeRange, setTimeRange] = useTimeRange("this-week");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🚀 OPTIMIZED: Use individual hooks for parallel loading
  // Add type assertion for the overview data
  const { data: overview, isLoading: isOverviewLoading, error: overviewError, refetch: refetchOverview } = usePurchaseOverview(timeRange) as { 
    data: Overview | undefined, 
    isLoading: boolean, 
    error: any, 
    refetch: () => void 
  };
  const { data: chartData, isLoading: isChartLoading, error: chartError, refetch: refetchChart } = usePurchaseChartData(timeRange);
  const { data: historyData, isLoading: isHistoryLoading, error: historyError, refetch: refetchHistory } = usePurchaseHistory(
    { timeRange, status: statusFilter !== "all" ? statusFilter : undefined },
    currentPage,
    itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">COMPLETED</Badge>;
      case "pending":
        return <Badge variant="outline">PENDING</Badge>;
      case "failed":
        return <Badge variant="destructive">FAILED</Badge>;
      default:
        return <Badge variant="secondary">{status.toUpperCase()}</Badge>;
    }
  };

  // Check if any critical data failed to load
  const hasCriticalError = overviewError || historyError;
  
  if (hasCriticalError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-destructive">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-destructive mb-2">Network Activity Load Failed</h2>
            <p className="text-center text-muted-foreground mb-6">We couldn't load your network activity right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchOverview(); refetchChart(); refetchHistory(); }} variant="destructive">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const purchases = historyData?.purchases || [];
  const totalPages = historyData?.totalPages || 1;

  // Determine groupBy for chart
  let groupBy: 'day' | 'week' | 'month' = 'day';
  if (["all-time", "this-month", "last-month", "this-quarter", "last-quarter"].includes(timeRange)) {
    groupBy = 'month';
  }
  if (["this-week", "last-week"].includes(timeRange)) {
    groupBy = 'day';
  }
  if (["this-quarter", "last-quarter"].includes(timeRange)) {
    groupBy = 'week';
  }
  const groupedChartData = groupChartData(chartData || [], groupBy);

  // Safe format functions
  const safeFormatThousands = (value: number | string | undefined): string => {
    if (typeof value === 'undefined') return '0';
    return formatThousands(String(value));
  };

  const safeFormatCurrency = (value: number | undefined, currency: string | undefined): string => {
    return `${safeFormatThousands(value)} ${currency || 'VP'}`;
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-semibold">
            Network Activity
          </h1>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <Calendar className="mr-2 h-4 w-4" />
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
      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Summary Stats */}
          {isOverviewLoading ? (
            <PurchasesSummaryCardsSkeleton />
          ) : overview ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="h-5 w-5 rounded bg-primary" />
                    </div>
                    <div>
                      <CardTitle>Volume Points</CardTitle>
                      <p className="text-sm text-muted-foreground">Total in period</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-md bg-muted">
                    <div className="text-2xl font-bold">
                      {safeFormatCurrency(overview.totalSpent, overview.currency)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <div className="h-5 w-5 rounded bg-success" />
                    </div>
                    <div>
                      <CardTitle>Total Purchases</CardTitle>
                      <p className="text-sm text-muted-foreground">Count in period</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-md bg-muted">
                    <div className="text-2xl font-bold">
                      {safeFormatThousands(overview.totalPurchases)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-muted-foreground text-center py-8">No purchase overview available.</div>
          )}

          {/* Network Purchases Over Time Chart */}
          {isChartLoading ? (
            <PurchasesChartSkeleton />
          ) : (chartData && chartData.length > 0) ? (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Network Transactions</CardTitle>
                    <p className="text-sm text-muted-foreground">Daily purchase activity and volume trends</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <LineChart data={groupedChartData} width={600} height={300}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickFormatter={date => formatXAxisLabel(date, groupBy)}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickFormatter={formatShortNumber}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      tickFormatter={formatShortNumber}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <Card>
                              <CardContent className="p-3">
                                <div className="font-medium mb-2">{label}</div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-primary">Purchases:</span>
                                    <span className="font-medium">{formatThousands(String(payload[0]?.value))}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-success">Volume:</span>
                                    <span className="font-medium">{formatThousands(String(parseInt(String(payload[1]?.value))))} VP</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="purchases"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="volume"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, stroke: "hsl(var(--success))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          ) : chartError ? (
            <div className="text-destructive text-center py-8">Failed to load chart data.</div>
          ) : null}

          {/* Purchases Table */}
          {isHistoryLoading ? (
            <PurchasesTableSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Filter className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Network Activity History</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Showing {Number(purchases.length)} of {formatThousands(Number(historyData?.total || 0))} transactions
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MobileTable
                  columns={[
                    {
                      key: 'date',
                      header: 'Date',
                      mobileLabel: 'Date',
                      render: (value) => new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    },
                    {
                      key: 'tokenId',
                      header: 'Item ID',
                      mobileLabel: 'Item',
                      render: (value, row) => (
                        <a
                          href={`https://polygonscan.com/nft/0x7681a8fba3b29533c7289dfab91dda24a48228ec/${value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline transition font-medium"
                        >
                          {categoryNames[row.category] || row.category} #{value}
                        </a>
                      )
                    },
                    {
                      key: 'amount',
                      header: 'Volume Points',
                      render: (value, row) => (
                        <span className="text-primary font-bold">
                          {formatThousands(parseInt(String(value)))} {row.currency}
                        </span>
                      )
                    },
                    {
                      key: 'source',
                      header: 'Buyer',
                      mobileLabel: 'Buyer',
                      render: (value, row) => `${value} (Level:${row.level})`
                    }
                  ]}
                  data={purchases}
                  keyField="id"
                  emptyMessage={historyError ? "Failed to load purchase history." : "No purchases found"}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Details Panel */}
        <div className="hidden xl:block w-[340px]">
          <div className="sticky top-0 p-6 space-y-6">
            {/* Quick Stats Section */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Volume</span>
                  <span className="text-sm font-medium">
                    {isOverviewLoading ? (
                      <Skeleton className="h-4 w-16 rounded" />
                    ) : (
                      safeFormatCurrency(overview?.totalSpent, overview?.currency)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Purchases</span>
                  <span className="text-sm font-medium">
                    {isOverviewLoading ? (
                      <Skeleton className="h-4 w-12 rounded" />
                    ) : (
                      safeFormatThousands(overview?.totalPurchases)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Feed Section */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {(purchases as Purchase[]).slice(0, 5).map((purchase) => (
                  <div key={purchase.id} className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Filter className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        {purchase.source} purchased {categoryNames[purchase.category] || purchase.category} #{purchase.tokenId}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(purchase.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 