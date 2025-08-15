"use client"

import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RankBadge } from "@/components/ranks/rank-badge"
import {
  Coins,
  LayoutDashboard,
  ShoppingCart,
  Users,
  TrendingUp,
  Trophy,
  Wallet,
  ChevronRight,
  Calendar,
  BarChart3,
  AlertTriangle,
  PieChart,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  useDashboardOverview, 
  useDashboardStats, 
  useDashboardCharts, 
  useRecentActivity, 
  useImmediateDownlines, 
  useCommissionBalances, 
  useNetworkGrowth 
} from "@/hooks/use-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PerformanceCardSkeleton,
  CommissionBalancesSkeleton,
  DownlinesSkeleton,
  ChartCardSkeleton
} from "@/components/dashboard/dashboard-skeletons"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { formatThousands, formatShortNumber } from "@/lib/utils"
import { useTheme } from "@/components/theme/theme-provider"
import { useTimeRange } from "@/hooks/use-time-range"
import { useProfile } from '@/hooks/use-auth'
import { addWeeks, addMonths, isBefore, format, parseISO } from 'date-fns'
import { useSetPageTitle } from "@/hooks/use-page-title"

// Add type definition at the top of the file
interface DashboardStats {
  purchases: number;
  purchasesChange: number;
  monthlyEarnings: number;
  vpChange: number;
  [key: string]: any; // Allow other properties
}

// Update card styles for better metrics and graph presentation
const cardStyles = {
  base: "bg-white dark:bg-[#1E1E1E] border border-[#E4E6EB] dark:border-[#2A2A2A] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:border-[#DADCE0] dark:hover:border-[#3A3A3A] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
  header: "flex items-center p-4 border-b border-[#E4E6EB] dark:border-[#2A2A2A]",
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
  listItem: "flex items-center justify-between py-3 first:pt-0 last:pb-0",
  listItemLeft: "flex items-center space-x-3",
  listItemLabel: "text-[14px] text-[#202124] dark:text-[#E6E6E6]",
  listItemValue: "text-[14px] font-medium text-[#297EFF] dark:text-[#4D8DFF]",
  divider: "border-t border-[#E4E6EB] dark:border-[#2A2A2A] my-4",
  emptyState: "text-center py-8",
  emptyStateIcon: "mx-auto w-12 h-12 text-[#9AA0A6] dark:text-[#A0A0A0] mb-3",
  emptyStateText: "text-[14px] text-[#5F6368] dark:text-[#A0A0A0]",
  chart: {
    container: "mt-4",
    title: "text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6] mb-4",
    wrapper: "w-full h-[300px]",
  },
};

// Helper to safely get a number from recharts payload value
function safeNumber(val: any): number {
  if (Array.isArray(val)) {
    return val.length > 0 ? Number(val[0]) : 0;
  }
  return Number(val) || 0;
}

export default function DashboardPage() {
  useProtectedRoute();
  useSetPageTitle("Dashboard");
  const [timeFilter, setTimeFilter] = useTimeRange("this-week");

  // 🚀 OPTIMIZED: Use individual hooks for parallel loading
  const { data: overview, isLoading: isOverviewLoading, isError: isOverviewError } = useDashboardOverview()
  const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useDashboardStats(timeFilter) as {
    data: DashboardStats | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  const { data: charts, isLoading: isChartsLoading, isError: isChartsError } = useDashboardCharts(timeFilter)
  const { data: recentActivity, isLoading: isActivityLoading, isError: isActivityError } = useRecentActivity(10)
  const { data: immediateDownlines, isLoading: isDownlinesLoading, isError: isDownlinesError } = useImmediateDownlines(timeFilter)
  const { data: balances, isLoading: isBalancesLoading, isError: isBalancesError } = useCommissionBalances(timeFilter)
  const { data: networkGrowthData, isLoading: isNetworkGrowthLoading, isError: isNetworkGrowthError } = useNetworkGrowth(timeFilter)
  
  const { data: profileData } = useProfile();
  const { theme } = useTheme();

  // Chart colors
  const chartColors = {
    primary: "#0846A6",
    secondary: "#00B28C",
    tertiary: "#6F00FF",
    accent: "#FF6B00",
  }

  // Chart tick colors for light mode
  const tickColors = {
    blue: "#0846A6",
    green: "#0B5B3C",
    purple: "#4B2067",
    gray: "#A0AFC0", // for dark mode
  };

  // 🚀 OPTIMIZED: Memoize expensive calculations to prevent re-computation on every render
  const { totalVP, sortedDownlines, topDownlines } = useMemo(() => {
    const downlines = immediateDownlines || [];
    const total = downlines.reduce((sum, d) => sum + Number(d.revenue), 0);
    const sorted = [...downlines].sort((a, b) => Number(b.revenue) - Number(a.revenue));
    const top = sorted.slice(0, 4);
    
    return { totalVP: total, sortedDownlines: sorted, topDownlines: top };
  }, [immediateDownlines]);

  // 🚀 OPTIMIZED: Memoize chart data processing for Purchases in Period
  const { purchaseVals, volumeVals, minPurchase, maxPurchase, minVolume, maxVolume } = useMemo(() => {
    const purchasesData = charts?.purchasesOverTime || [];
    const purchases = purchasesData.map(d => d.purchases).filter(v => v > 0);
    const volumes = purchasesData.map(d => d.volume).filter(v => v > 0);
    
    return {
      purchaseVals: purchases,
      volumeVals: volumes,
      minPurchase: Math.min(...purchases, Infinity),
      maxPurchase: Math.max(...purchases, -Infinity),
      minVolume: Math.min(...volumes, Infinity),
      maxVolume: Math.max(...volumes, -Infinity),
    };
  }, [charts?.purchasesOverTime]);

  const useLogScalePurchases = false; //minPurchase > 0 && maxPurchase / minPurchase > 100;
  const useLogScaleVolume = false; //minVolume > 0 && maxVolume / minVolume > 100;

  // 🚀 OPTIMIZED: Memoize network growth data processing
  const { totalMembersVals, activeMembersVals } = useMemo(() => {
    const growthData = networkGrowthData || [];
    return {
      totalMembersVals: growthData.map(d => d.totalMembers).filter(v => v > 0),
      activeMembersVals: growthData.map(d => d.activeMembers).filter(v => v > 0),
    };
  }, [networkGrowthData]);
  const minTotalMembers = Math.min(...totalMembersVals, Infinity);
  const maxTotalMembers = Math.max(...totalMembersVals, -Infinity);
  const minActiveMembers = Math.min(...activeMembersVals, Infinity);
  const maxActiveMembers = Math.max(...activeMembersVals, -Infinity);
  const useLogScaleGrowth = false; //minTotalMembers > 0 && maxTotalMembers / minTotalMembers > 100;

  // --- Network Growth Data Grouping ---
  let processedGrowthData = [];
  if (networkGrowthData && profileData?.joinDate) {
    const joinDate = parseISO(profileData.joinDate);
    const now = new Date();
    let current = joinDate;
    let weekCount = 0;
    // Weekly for first 12 weeks
    while (weekCount < 12 && isBefore(current, now)) {
      const weekLabel = format(current, 'MMM d, yyyy');
      const dataPoint = networkGrowthData.find(d => d.date === weekLabel);
      processedGrowthData.push(dataPoint || { date: weekLabel, totalMembers: 0 });
      current = addWeeks(current, 1);
      weekCount++;
    }
    // Monthly after 12 weeks
    while (isBefore(current, now)) {
      const monthLabel = format(current, 'MMM yyyy');
      const dataPoint = networkGrowthData.find(d => d.date === monthLabel);
      processedGrowthData.push(dataPoint || { date: monthLabel, totalMembers: 0 });
      current = addMonths(current, 1);
    }
  } else {
    processedGrowthData = networkGrowthData || [];
  }

  // Define balance colors with proper type
  const balanceColors: { [key: string]: string } = {
    'GC-He': '#297EFF',
    'GC-H': '#00B28C',
    'GCC1': '#6F00FF',
    'USDT': '#FF6B00'
  } as const;

  // Check if any critical data failed to load
  const hasCriticalError = isOverviewError || isStatsError;
  
  if (hasCriticalError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Dashboard Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your dashboard data right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => window.location.reload()} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-[22px] font-semibold text-[#202124] dark:text-[#E6E6E6]">
            Dashboard Overview
          </h1>
          <div className="flex items-center w-full sm:w-auto">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="h-11 sm:h-9 w-full sm:w-48 bg-white dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6]">
                <Calendar className="mr-2 h-5 w-5 sm:h-4 sm:w-4 text-[#5F6368] dark:text-[#A0A0A0]" />
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time" className="h-11 sm:h-9">All Time</SelectItem>
                <SelectItem value="this-week" className="h-11 sm:h-9">This Week</SelectItem>
                <SelectItem value="this-month" className="h-11 sm:h-9">This Month</SelectItem>
                <SelectItem value="this-quarter" className="h-11 sm:h-9">This Quarter</SelectItem>
                <SelectItem value="last-week" className="h-11 sm:h-9">Last Week</SelectItem>
                <SelectItem value="last-month" className="h-11 sm:h-9">Last Month</SelectItem>
                <SelectItem value="last-quarter" className="h-11 sm:h-9">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content with Right Panel */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Performance Card */}
            {isStatsLoading ? (
              <PerformanceCardSkeleton />
            ) : (
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <TrendingUp className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Performance</h3>
                      <p className={cardStyles.subtitle}>Period overview</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={cardStyles.metric.container}>
                      <div>
                        <div className={cardStyles.metric.label}>Total Purchases</div>
                        <div className={`${cardStyles.metric.value} text-[16px] sm:text-[20px]`}>
                          {formatThousands(Number((stats as any)?.purchases || 0))}
                        </div>
                        <div className={
                          ((stats as any)?.purchasesChange ?? 0) >= 0 
                            ? cardStyles.metric.change.positive 
                            : cardStyles.metric.change.negative
                        }>
                          {((stats as any)?.purchasesChange ?? 0) >= 0 ? '↑' : '↓'} {Math.abs((stats as any)?.purchasesChange ?? 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className={cardStyles.metric.container}>
                      <div>
                        <div className={cardStyles.metric.label}>Total VP</div>
                        <div className={`${cardStyles.metric.value} text-[16px] sm:text-[20px]`}>
                          {formatThousands(Math.floor(Number((stats as any)?.monthlyEarnings || 0)))}
                        </div>
                        <div className={
                          ((stats as any)?.vpChange ?? 0) >= 0 
                            ? cardStyles.metric.change.positive 
                            : cardStyles.metric.change.negative
                        }>
                          {((stats as any)?.vpChange ?? 0) >= 0 ? '↑' : '↓'} {Math.abs((stats as any)?.vpChange ?? 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${cardStyles.chart.container} min-h-[200px] sm:min-h-[300px]`}>
                    <div className={cardStyles.chart.title}>Performance Trend</div>
                    <div className={`${cardStyles.chart.wrapper} h-[200px] sm:h-[300px]`}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={charts?.purchasesOverTime || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2C2F3C" opacity={0.1} />
                          <XAxis 
                            dataKey="date" 
                            stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                            tick={{ fill: theme === "dark" ? "#A0A0A0" : "#5F6368", fontSize: 10 }}
                            interval="preserveStartEnd"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            tickMargin={20}
                          />
                          <YAxis 
                            stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                            tick={{ fill: theme === "dark" ? "#A0A0A0" : "#5F6368", fontSize: 10 }}
                            tickFormatter={formatShortNumber}
                            width={45}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                              border: `1px solid ${theme === "dark" ? "#2A2A2A" : "#E4E6EB"}`,
                              borderRadius: "8px",
                              padding: "12px",
                              fontSize: "12px"
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="purchases"
                            stroke="#297EFF"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, stroke: "#297EFF", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Commission Balances Card */}
            {isBalancesLoading ? (
              <CommissionBalancesSkeleton />
            ) : (
              <div className={`${cardStyles.base} col-span-1 sm:col-span-2 lg:col-span-1`}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <Coins className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Commission Balances</h3>
                      <p className={cardStyles.subtitle}>Total VP: {formatThousands(Math.floor(balances?.totalVP || 0))}</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { label: 'GC-He' as const, value: balances?.['HE'] || 0 },
                      { label: 'GC-H' as const, value: balances?.['H'] || 0 },
                      { label: 'GCC1' as const, value: balances?.['GCC1'] || 0 },
                      { label: 'USDT' as const, value: balances?.['USDT'] || 0 }
                    ].map((item) => (
                      <div 
                        key={item.label} 
                        className="p-3 sm:p-4 rounded-lg border border-[#E4E6EB] dark:border-[#2A2A2A] bg-[#F8F9FB] dark:bg-[#1A2B45]"
                        style={{ borderLeft: `3px solid ${balanceColors[item.label]}` }}
                      >
                        <div className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">{item.label}</div>
                        <div className="text-[14px] sm:text-[18px] font-semibold text-[#202124] dark:text-[#E6E6E6] mt-1">
                          {formatThousands(Math.floor(Number(item.value)))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`${cardStyles.chart.container} min-h-[200px] sm:min-h-[300px]`}>
                    <div className={cardStyles.chart.title}>Balance Distribution</div>
                    <div className={`${cardStyles.chart.wrapper} h-[200px] sm:h-[300px]`}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'GC-He', value: balances?.['HE'] || 0 },
                              { name: 'GC-H', value: balances?.['H'] || 0 },
                              { name: 'GCC1', value: (balances?.['GCC1']|| 0)/100 || 0 },
                              { name: 'USDT', value: balances?.['USDT'] || 0 }
                            ].map(item => ({
                              ...item,
                              displayValue: Number(item.value) / 100, // Divide by 100 for display
                              value: item.value // Keep original value for tooltip
                            }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="displayValue" // Use displayValue for the pie segments
                          >
                            {Object.entries(balanceColors).map(([key, color], index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                              border: `1px solid ${theme === "dark" ? "#2A2A2A" : "#E4E6EB"}`,
                              borderRadius: "8px",
                              padding: "12px",
                            }}
                            formatter={(value, name, entry) => [
                              formatThousands(Number(entry.payload.value)), // Use original value for tooltip
                              name
                            ]}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                              <span className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">{value}</span>
                            )}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performers Card */}
            {isDownlinesLoading ? (
              <DownlinesSkeleton />
            ) : (
              <div className={`${cardStyles.base} col-span-1 sm:col-span-2 lg:col-span-1`}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <Users className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Top Performers</h3>
                      <p className={cardStyles.subtitle}>Active downlines: {topDownlines.length}</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  {topDownlines.length === 0 ? (
                    <div className={cardStyles.emptyState}>
                      <Users className={cardStyles.emptyStateIcon} />
                      <p className={cardStyles.emptyStateText}>
                        No active downlines in selected period
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {topDownlines.map((downline: any, index: number) => (
                        <div 
                          key={downline.id} 
                          className="p-4 sm:p-3 rounded-lg border border-[#E4E6EB] dark:border-[#2A2A2A] bg-[#F8F9FB] dark:bg-[#1A2B45] flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3 sm:space-x-2">
                            <div className="flex items-center justify-center w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-[#297EFF]/10 dark:bg-[#4D8DFF]/10 text-[#297EFF] dark:text-[#4D8DFF] font-medium text-[14px] sm:text-[12px]">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="text-[12px] sm:text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6] flex items-center space-x-2">
                                <span>{downline.nickname}</span>
                                <div className={`w-2 h-2 rounded-full ${downline.status === 'active' ? 'bg-[#00B28C]' : 'bg-[#5F6368]'}`} />
                              </div>
                              <div className="text-[10px] sm:text-[12px] text-[#5F6368] dark:text-[#A0A0A0] flex items-center space-x-2">
                                <RankBadge rank={downline.rank || "Starter"} size="sm" showIcon={false} />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[14px] sm:text-[16px] font-semibold text-[#297EFF] dark:text-[#4D8DFF]">
                              {formatThousands(Math.floor(Number(downline.revenue)))} VP
                            </div>
                            <div className="text-[10px] sm:text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">
                              Total Volume
                            </div>
                          </div>
                        </div>
                      ))}
                      {immediateDownlines && immediateDownlines.length > 4 && (
                        <a 
                          href="/network" 
                          className="block text-[14px] text-[#297EFF] dark:text-[#4D8DFF] text-center hover:underline mt-4 py-3 sm:py-2"
                        >
                          View all {immediateDownlines.length} downlines →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Purchases Chart */}
            {isChartsLoading ? (
              <ChartCardSkeleton title="Purchases Activity" />
            ) : (
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <BarChart3 className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Purchase Activity</h3>
                      <p className={cardStyles.subtitle}>Network purchase trends over time</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  {isChartsError ? (
                    <div className={cardStyles.emptyState}>
                      <AlertTriangle className={cardStyles.emptyStateIcon} />
                      <p className={cardStyles.emptyStateText}>Failed to load chart data</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={256}>
                      <LineChart data={charts?.purchasesOverTime || []}>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme === "dark" ? "#2A2A2A" : "#E4E6EB"} 
                          opacity={0.5}
                        />
                        <XAxis
                          dataKey="date"
                          stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                          tick={{ 
                            fill: theme === "dark" ? "#A0A0A0" : "#5F6368", 
                            fontSize: 10 
                          }}
                          interval="preserveStartEnd"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tickMargin={20}
                        />
                        <YAxis
                          yAxisId="left"
                          scale={useLogScalePurchases ? "log" : "linear"}
                          domain={useLogScalePurchases ? [1, 'auto'] : ['auto', 'auto']}
                          allowDataOverflow={useLogScalePurchases}
                          stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                          tick={{ 
                            fill: theme === "dark" ? "#A0A0A0" : "#5F6368", 
                            fontSize: 10 
                          }}
                          tickFormatter={formatShortNumber}
                          width={45}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          scale={useLogScaleVolume ? "log" : "linear"}
                          domain={useLogScaleVolume ? [1, 'auto'] : ['auto', 'auto']}
                          allowDataOverflow={useLogScaleVolume}
                          stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                          tick={{ 
                            fill: theme === "dark" ? "#A0A0A0" : "#5F6368", 
                            fontSize: 10 
                          }}
                          tickFormatter={formatShortNumber}
                          width={45}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                            border: `1px solid ${theme === "dark" ? "#2A2A2A" : "#E4E6EB"}`,
                            borderRadius: "8px",
                            padding: "12px",
                            fontSize: "12px"
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            color: theme === "dark" ? "#A0A0A0" : "#5F6368",
                            fontSize: "10px",
                            paddingTop: "8px"
                          }}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="purchases"
                          stroke="#297EFF"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, stroke: "#297EFF", strokeWidth: 2 }}
                          name="Purchases"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="volume"
                          stroke="#00B28C"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, stroke: "#00B28C", strokeWidth: 2 }}
                          name="Volume"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}

            {/* Commission Sources Chart */}
            {isChartsLoading ? (
              <ChartCardSkeleton title="Commission Sources" />
            ) : (
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <PieChart className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Commission Sources</h3>
                      <p className={cardStyles.subtitle}>Breakdown by commission type</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  {isChartsError ? (
                    <div className={cardStyles.emptyState}>
                      <AlertTriangle className={cardStyles.emptyStateIcon} />
                      <p className={cardStyles.emptyStateText}>Failed to load chart data</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={256}>
                      <RechartsPieChart>
                        <Pie
                          data={(charts as any)?.commissionSources || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={window.innerWidth < 640 ? 40 : 60}
                          outerRadius={window.innerWidth < 640 ? 70 : 100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {(charts as any)?.commissionSources?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                            border: `1px solid ${theme === "dark" ? "#2A2A2A" : "#E4E6EB"}`,
                            borderRadius: "8px",
                            padding: "12px",
                            fontSize: "12px"
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          wrapperStyle={{
                            color: theme === "dark" ? "#A0A0A0" : "#5F6368",
                            fontSize: "10px",
                            paddingTop: "8px"
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Commission Breakdown Chart */}
            {isChartsLoading ? (
              <ChartCardSkeleton title="Commission Breakdown" />
            ) : (
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <BarChart3 className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Commission Breakdown</h3>
                      <p className={cardStyles.subtitle}>Detailed commission analysis</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  {isChartsError ? (
                    <div className={cardStyles.emptyState}>
                      <AlertTriangle className={cardStyles.emptyStateIcon} />
                      <p className={cardStyles.emptyStateText}>Failed to load chart data</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={256}>
                      <BarChart data={(charts as any)?.commissionBreakdown || []}>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme === "dark" ? "#2A2A2A" : "#E4E6EB"} 
                          opacity={0.5}
                        />
                        <XAxis
                          dataKey="month"
                          stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                          tick={{ 
                            fill: theme === "dark" ? "#A0A0A0" : "#5F6368", 
                            fontSize: 10 
                          }}
                          interval="preserveStartEnd"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tickMargin={20}
                        />
                        <YAxis
                          stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                          tick={{ 
                            fill: theme === "dark" ? "#A0A0A0" : "#5F6368", 
                            fontSize: 10 
                          }}
                          tickFormatter={formatShortNumber}
                          width={45}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                            border: `1px solid ${theme === "dark" ? "#2A2A2A" : "#E4E6EB"}`,
                            borderRadius: "8px",
                            padding: "12px",
                            fontSize: "12px"
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            color: theme === "dark" ? "#A0A0A0" : "#5F6368",
                            fontSize: "10px",
                            paddingTop: "8px"
                          }}
                        />
                        <Bar 
                          dataKey="c1" 
                          fill="#297EFF" 
                          name="Direct Commission" 
                          maxBarSize={40}
                        />
                        <Bar 
                          dataKey="c2" 
                          fill="#00B28C" 
                          name="Team Commission" 
                          maxBarSize={40}
                        />
                        <Bar 
                          dataKey="c3" 
                          fill="#6F00FF" 
                          name="Leadership Commission" 
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}

            {/* Network Growth Chart */}
            {isNetworkGrowthLoading ? (
              <ChartCardSkeleton title="Network Growth" />
            ) : (
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <TrendingUp className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Network Growth</h3>
                      <p className={cardStyles.subtitle}>Your network expansion over time</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  {isNetworkGrowthError ? (
                    <div className={cardStyles.emptyState}>
                      <AlertTriangle className={cardStyles.emptyStateIcon} />
                      <p className={cardStyles.emptyStateText}>Failed to load chart data</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={256}>
                      <LineChart data={processedGrowthData}>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme === "dark" ? "#2A2A2A" : "#E4E6EB"} 
                          opacity={0.5}
                        />
                        <XAxis
                          dataKey="date"
                          stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                          tick={{ 
                            fill: theme === "dark" ? "#A0A0A0" : "#5F6368", 
                            fontSize: 10 
                          }}
                          interval="preserveStartEnd"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tickMargin={20}
                        />
                        <YAxis
                          scale={useLogScaleGrowth ? "log" : "linear"}
                          domain={useLogScaleGrowth ? [1, 'auto'] : [0, 'auto']}
                          allowDataOverflow={useLogScaleGrowth}
                          stroke={theme === "dark" ? "#A0A0A0" : "#5F6368"}
                          tick={{ 
                            fill: theme === "dark" ? "#A0A0A0" : "#5F6368", 
                            fontSize: 10 
                          }}
                          tickFormatter={formatShortNumber}
                          width={45}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                            border: `1px solid ${theme === "dark" ? "#2A2A2A" : "#E4E6EB"}`,
                            borderRadius: "8px",
                            padding: "12px",
                            fontSize: "12px"
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            color: theme === "dark" ? "#A0A0A0" : "#5F6368",
                            fontSize: "10px",
                            paddingTop: "8px"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="totalMembers"
                          stroke="#297EFF"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, stroke: "#297EFF", strokeWidth: 2 }}
                          name="Total Members"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Details Panel - Show below main content on mobile */}
        <div className="lg:w-[340px] bg-white dark:bg-[#1E1E1E] border-t lg:border-t-0 lg:border-l border-[#E4E6EB] dark:border-[#2A2A2A]">
          <div className="lg:sticky lg:top-0 p-6 space-y-6">
            {/* Quick Stats Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-0 lg:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">AllTime VP</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-16 sm:w-20 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      `${formatThousands((stats as any)?.personalEarnings?.toFixed(0) ?? 0)} VP`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Active Downlines</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isNetworkGrowthLoading ? (
                      <Skeleton className="h-4 w-12 sm:w-16 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      `${formatThousands((networkGrowthData as any)?.activeMembers?.toLocaleString() ?? 0)}/${formatThousands((networkGrowthData as any)?.totalDirectDownlines || 0)}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Current Rank</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 sm:w-16 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      <RankBadge rank={profileData?.rank || "Starter"} size="sm" showIcon={false} />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Own Turnover</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 sm:w-16 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      formatThousands((stats as any)?.ownTurnover?.toFixed(2) ?? 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Feed Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {isActivityLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full dark:bg-[#2C2F3C]" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 dark:bg-[#2C2F3C] rounded mb-2" />
                          <Skeleton className="h-3 w-1/2 dark:bg-[#2C2F3C] rounded" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex items-start space-x-3">
                    <div className="p-3 sm:p-2 rounded-full bg-[#297EFF]/10">
                      <Users className="h-5 w-5 sm:h-4 sm:w-4 text-[#297EFF]" />
                    </div>
                    <div>
                      <p className="text-[14px] text-[#202124] dark:text-[#E6E6E6]">
                        New downline joined
                      </p>
                      <span className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">
                        2 hours ago
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
