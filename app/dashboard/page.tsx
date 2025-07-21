"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { MetricCard, MetricCardContent } from "@/components/ui/metric-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { TrendingUp, Users, Coins, Trophy, BarChart3, PieChart, Calendar, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardData } from "@/hooks/use-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
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
import { Badge } from "@/components/ui/badge"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { formatThousands, formatShortNumber } from "@/lib/utils"
import { useTheme } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"
import { useNetworkGrowth } from "@/hooks/use-dashboard"
import { useTimeRange } from "@/hooks/use-time-range"
import { useProfile } from '@/hooks/use-auth';
import { addWeeks, addMonths, isBefore, format, parseISO } from 'date-fns';

// Helper to safely get a number from recharts payload value
function safeNumber(val: any): number {
  if (Array.isArray(val)) {
    return val.length > 0 ? Number(val[0]) : 0;
  }
  return Number(val) || 0;
}

export default function DashboardPage() {
  useProtectedRoute()
  const [timeFilter, setTimeFilter] = useTimeRange("this-week")
  const { data, isLoading, isError, refetch } = useDashboardData(timeFilter)
  const { data: networkGrowthData, isLoading: isNetworkGrowthLoading, isError: isNetworkGrowthError } = useNetworkGrowth(timeFilter)
  const { data: profileData } = useProfile();
  const { theme } = useTheme();

  // Extract data safely
  const overview = data?.overview
  const stats = data?.stats
  const balances = data?.commissionBalances
  const charts = data?.charts

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

  const totalVP = data?.immediateDownlines?.reduce((sum, d) => sum + Number(d.revenue), 0) ?? 0
  const sortedDownlines = (data?.immediateDownlines?.slice() ?? []).sort((a, b) => Number(b.revenue) - Number(a.revenue));
  const topDownlines = sortedDownlines.slice(0, 4);

  // --- Dynamic scale logic for Purchases in Period ---
  const purchasesData = charts?.purchasesOverTime || [];
  const purchaseVals = purchasesData.map(d => d.purchases).filter(v => v > 0);
  const volumeVals = purchasesData.map(d => d.volume).filter(v => v > 0);
  const minPurchase = Math.min(...purchaseVals, Infinity);
  const maxPurchase = Math.max(...purchaseVals, -Infinity);
  const minVolume = Math.min(...volumeVals, Infinity);
  const maxVolume = Math.max(...volumeVals, -Infinity);
  const useLogScalePurchases = false; //minPurchase > 0 && maxPurchase / minPurchase > 100;
  const useLogScaleVolume = false; //minVolume > 0 && maxVolume / minVolume > 100;

  // --- Dynamic scale logic for Network Growth ---
  const growthData = networkGrowthData || [];
  const totalMembersVals = growthData.map(d => d.totalMembers).filter(v => v > 0);
  const activeMembersVals = growthData.map(d => d.activeMembers).filter(v => v > 0);
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

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Dashboard Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your dashboard data right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => refetch()} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="MY DASHBOARD" description="Overview of my network performance" />
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-72 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="MY DASHBOARD" description="Overview of my network performance" />

      {/* Time Filter */}
      <div className="flex justify-end">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-[#A0AFC0]" />
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-48 dark:bg-[#1A1E2D] dark:border-[#2C2F3C] text-white">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-none">
              <SelectItem value="all-time" className="dark:text-white dark:hover:bg-[#2C2F3C]">
                All Time
              </SelectItem>
              <SelectItem value="this-week" className="dark:text-white dark:hover:bg-[#2C2F3C]">
                This Week
              </SelectItem>
              <SelectItem value="this-month" className="dark:text-white dark:hover:bg-[#2C2F3C]">
                This Month
              </SelectItem>
              <SelectItem value="this-quarter" className="dark:text-white dark:hover:bg-[#2C2F3C]">
                This Quarter
              </SelectItem>
              <SelectItem value="last-week" className="dark:text-white dark:hover:bg-[#2C2F3C]">
                Last Week
              </SelectItem>
              <SelectItem value="last-month" className="dark:text-white dark:hover:bg-[#2C2F3C]">
                Last Month
              </SelectItem>
              <SelectItem value="last-quarter" className="dark:text-white dark:hover:bg-[#2C2F3C]">
                Last Quarter
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top Metrics Row */}
      {isError ? (
        <div className="text-red-500">Failed to load dashboard data.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C] col-span-1 md:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-[#0846A6]/10">
                    <TrendingUp className="h-6 w-6 text-[#0846A6] dark:text-[#0846A6]" />
                  </div>
                  <div>
                    <div className="text-[#0846A6] dark:text-[#A0AFC0] text-sm uppercase tracking-wider"></div>
                    <div className="text-2xl font-bold text-white">
                      PERFORMANCE
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <MetricCardContent title="TOTAL PURCHASES IN PERIOD"
                  value={formatThousands(Number(stats?.purchases || 0)) ?? 0}
                  icon={TrendingUp}
                  change={{ value: `+${formatThousands(Number(stats?.successRate) > 100? 100 :stats?.successRate.toFixed(2) ?? 0)}%`, type: "positive" }} />

                <MetricCardContent title="TOTAL VP IN PERIOD"
                  value={formatThousands(Math.floor(Number(stats?.monthlyEarnings||0))) ?? 0}
                  icon={TrendingUp}
                  change={{ value: `+${formatThousands(Number(stats?.successRate) > 100? 100 :stats?.successRate.toFixed(2) ?? 0)}%`, type: "positive" }} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C] col-span-1 md:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-[#0846A6]/10">
                    <Users className="h-6 w-6 text-[#0846A6] dark:text-[#0846A6]" />
                  </div>
                  <div>
                    <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">COMMISSION ELIGIBLE BASE</div>
                    <div className="text-2xl font-bold text-white">
                      {formatThousands(Math.floor(totalVP)) || '0'} VP
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-m font-medium">GC-He</span>
                      
                    </div>
                    <span className="text-[#0846A6] dark:text-[#0846A6] text-sm font-bold">
                    {formatThousands(Math.floor(Number(balances? balances['HE'] : 0.00)))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-m font-medium">GC-H</span>
                      
                    </div>
                    <span className="text-[#0846A6] dark:text-[#0846A6] text-sm font-bold">
                    {formatThousands(Math.floor(Number(balances? balances['H'] : 0.00)))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-m font-medium">GCC1</span>
                      
                    </div>
                    <span className="text-[#0846A6] dark:text-[#0846A6] text-sm font-bold">
                    {formatThousands(Math.floor(Number(balances? balances['GCC1'] : 0.00)))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-m font-medium">USDT</span>
                      
                    </div>
                    <span className="text-[#0846A6] dark:text-[#0846A6] text-sm font-bold">
                      {formatThousands(Math.floor(Number(balances? balances['USDT'] : 0.00)))}
                    </span>
                  </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C] col-span-1 md:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-[#0846A6]/10">
                    <Users className="h-6 w-6 text-[#0846A6] dark:text-[#0846A6]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      VP BY DOWNLINES
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {topDownlines.length === 0 && (
                  <div className="text-[#A0AFC0] text-xs text-center pt-2">
                    No active downlines in selected period
                  </div>
                )}
                {topDownlines.map((downline: any) => (
                  <div key={downline.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${downline.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-white text-sm font-medium">{downline.nickname}</span>
                      <Badge className="text-xs bg-[#2C2F3C] text-[#A0AFC0] border-[#2C2F3C]">
                        {downline.rank?.split(" Member")[0] || 'Member'}
                      </Badge>
                    </div>
                    <span className="text-[#0846A6] dark:text-[#0846A6] text-sm font-bold">
                      {formatThousands(Math.floor(Number(downline.revenue)))} VP
                    </span>
                  </div>
                ))}
                {data?.immediateDownlines && data.immediateDownlines.length > 4 && (
                  <a href="/purchases" className="text-[#A0AFC0] text-xs text-center pt-2 block hover:underline cursor-pointer">
                    +{data.immediateDownlines.length - 4} more downlines
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Middle Section - 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="PURCHASES IN PERIOD" description="My network's activity in selected period">
          {isError ? (
            <div className="text-red-500">Failed to load chart data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <LineChart data={charts?.purchasesOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2F3C" />
                <XAxis
                  dataKey="date"
                  stroke={theme === "dark" ? tickColors.gray : tickColors.blue}
                  tick={{ fill: theme === "dark" ? tickColors.gray : tickColors.blue, fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  scale={useLogScalePurchases ? "log" : "linear"}
                  domain={useLogScalePurchases ? [1, 'auto'] : ['auto', 'auto']}
                  allowDataOverflow={useLogScalePurchases}
                  stroke={theme === "dark" ? tickColors.gray : tickColors.blue}
                  tick={{ fill: theme === "dark" ? tickColors.gray : tickColors.blue, fontSize: 12 }}
                  tickFormatter={formatShortNumber}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  scale={useLogScaleVolume ? "log" : "linear"}
                  domain={useLogScaleVolume ? [1, 'auto'] : ['auto', 'auto']}
                  allowDataOverflow={useLogScaleVolume}
                  stroke={theme === "dark" ? tickColors.gray : tickColors.blue}
                  tick={{ fill: theme === "dark" ? tickColors.gray : tickColors.blue, fontSize: 12 }}
                  tickFormatter={formatShortNumber}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const purchasesRaw = payload.find(p => p.dataKey === 'purchases')?.value ?? 0;
                      const volumeRaw = payload.find(p => p.dataKey === 'volume')?.value ?? 0;
                      const purchases = Math.floor(safeNumber(purchasesRaw));
                      const volume = Math.floor(safeNumber(volumeRaw));
                      return (
                        <div style={{ backgroundColor: '#1A1E2D', border: '1px solid #2C2F3C', borderRadius: 8, color: '#A0AFC0', padding: 12 }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span>Purchases:</span>
                            <span style={{ color: '#0846A6', fontWeight: 600 }}>{formatThousands(Number(purchases))}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span>Volume:</span>
                            <span style={{ color: '#00B28C', fontWeight: 600 }}>{formatThousands(Number(volume))} VP</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="purchases"
                  stroke={chartColors.primary}
                  strokeWidth={2}
                  dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="volume"
                  stroke={chartColors.secondary}
                  strokeWidth={2}
                  dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartColors.secondary, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="COMMISSION SOURCES" description="Breakdown by commission type for selected period">
          {isError ? (
            <div className="text-red-500">Failed to load chart data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <RechartsPieChart>
                <Pie
                  data={(charts as any)?.commissionSources || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts as any)?.commissionSources?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #2C2F3C",
                    borderRadius: "8px",
                    color: "#A0AFC0",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    color: theme === "dark" ? tickColors.gray : tickColors.purple,
                    fontSize: "12px",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Bottom Section - 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="COMMISSION BREAKDOWN" description="Detailed commission analysis">
          {isError ? (
            <div className="text-red-500">Failed to load chart data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={(charts as any)?.commissionBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2F3C" />
                <XAxis
                  dataKey="month"
                  stroke={theme === "dark" ? tickColors.gray : tickColors.green}
                  tick={{ fill: theme === "dark" ? tickColors.gray : tickColors.green, fontSize: 12 }}
                />
                <YAxis
                  stroke={theme === "dark" ? tickColors.gray : tickColors.green}
                  tick={{ fill: theme === "dark" ? tickColors.gray : tickColors.green, fontSize: 12 }}
                  tickFormatter={formatShortNumber}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const c1Raw = payload.find(p => p.dataKey === 'c1')?.value ?? 0;
                      const c2Raw = payload.find(p => p.dataKey === 'c2')?.value ?? 0;
                      const c3Raw = payload.find(p => p.dataKey === 'c3')?.value ?? 0;
                      const c1 = Math.floor(safeNumber(c1Raw));
                      const c2 = Math.floor(safeNumber(c2Raw));
                      const c3 = Math.floor(safeNumber(c3Raw));
                      return (
                        <div style={{ backgroundColor: '#1A1E2D', border: '1px solid #2C2F3C', borderRadius: 8, color: '#A0AFC0', padding: 12 }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span>C1:</span>
                            <span style={{ color: '#0846A6', fontWeight: 600 }}>{formatThousands(Number(c1))}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span>C2:</span>
                            <span style={{ color: '#00B28C', fontWeight: 600 }}>{formatThousands(Number(c2))}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span>C3:</span>
                            <span style={{ color: '#6F00FF', fontWeight: 600 }}>{formatThousands(Number(c3))}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: theme === "dark" ? tickColors.gray : tickColors.green,
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="c1" fill={chartColors.primary} name="C1" />
                <Bar dataKey="c2" fill={chartColors.secondary} name="C2" />
                <Bar dataKey="c3" fill={chartColors.tertiary} name="C3" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="NETWORK GROWTH" description="Your network expansion over time">
          {isError || isNetworkGrowthError ? (
            <div className="text-red-500">Failed to load chart data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <LineChart data={processedGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2F3C" />
                <XAxis
                  dataKey="date"
                  stroke={theme === "dark" ? tickColors.gray : tickColors.blue}
                  tick={{ fill: theme === "dark" ? tickColors.gray : tickColors.blue, fontSize: 12 }}
                />
                <YAxis
                  scale={useLogScaleGrowth ? "log" : "linear"}
                  domain={useLogScaleGrowth ? [1, 'auto'] : ['auto', 'auto']}
                  allowDataOverflow={useLogScaleGrowth}
                  stroke={theme === "dark" ? tickColors.gray : tickColors.blue}
                  tick={{ fill: theme === "dark" ? tickColors.gray : tickColors.blue, fontSize: 12 }}
                  tickFormatter={formatShortNumber}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const totalMembersRaw = payload.find(p => p.dataKey === 'totalMembers')?.value ?? 0;
                      const totalMembers = Math.floor(safeNumber(totalMembersRaw));
                      return (
                        <div style={{ backgroundColor: '#1A1E2D', border: '1px solid #2C2F3C', borderRadius: 8, color: '#A0AFC0', padding: 12 }}>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span>Total Members:</span>
                            <span style={{ color: '#0846A6', fontWeight: 600 }}>{formatThousands(Number(totalMembers))}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: theme === "dark" ? tickColors.gray : tickColors.blue,
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalMembers"
                  stroke={chartColors.primary}
                  strokeWidth={2}
                  dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2 }}
                  name="Total Members"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </>
  )
}
