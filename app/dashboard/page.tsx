"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { TrendingUp, Users, Coins, Trophy, BarChart3, PieChart, Calendar } from "lucide-react"
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

export default function DashboardPage() {
  useProtectedRoute()
  const [timeFilter, setTimeFilter] = useState("this-week")
  const { data, isLoading, isError } = useDashboardData(timeFilter)

  // Extract data safely
  const overview = data?.overview
  const stats = data?.stats
  const charts = data?.charts

  // Chart colors
  const chartColors = {
    primary: "#00E5FF",
    secondary: "#00FFC8",
    tertiary: "#6F00FF",
    accent: "#FF6B00",
  }

  if (isLoading) {
    return (
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6 space-y-6">
            <PageHeader title="MY DASHBOARD" description="Overview of my network performance" />
            {/* Metric Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <Skeleton key={i} className="h-28 w-full bg-[#2C2F3C] rounded-lg" />
              ))}
            </div>
            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {[1,2,3,4].map(i => (
                <Skeleton key={i} className="h-72 w-full bg-[#2C2F3C] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </ModernSidebar>
    )
  }

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="DASHBOARD" description="Overview of your NFT sales performance" />

          {/* Time Filter */}
          <div className="flex justify-end">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-[#A0AFC0]" />
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-48 bg-[#1A1E2D] border-[#2C2F3C] text-white">
                  <SelectValue placeholder="Select time period" />
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
          </div>

          {/* Top Metrics Row */}
          {isError ? (
            <div className="text-red-500">Failed to load dashboard data.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="TOTAL PURCHASES"
                value={stats?.totalNetworkSize ?? 0}
                icon={TrendingUp}
                change={{ value: `+${stats?.monthlyGrowth ?? 0}%`, type: "positive" }}
              />
              <MetricCard
                title="TOTAL COMMISSIONS"
                value={`${overview?.totalEarnings ?? 0} USDC`}
                icon={Coins}
                change={{ value: `+${stats?.monthlyGrowth ?? 0}%`, type: "positive" }}
              />
              <Card className="bg-[#1A1E2D] border-[#2C2F3C] col-span-1 md:col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-[#00E5FF]/10">
                        <Users className="h-6 w-6 text-[#00E5FF]" />
                      </div>
                      <div>
                        <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">IMMEDIATE DOWNLINES</div>
                        <div className="text-2xl font-bold text-white">
                          {data?.immediateDownlines?.reduce((sum: number, downline: any) => sum + downline.revenue, 0).toFixed(2) || '0.00'} USDC
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {data?.immediateDownlines?.slice(0, 3).map((downline: any) => (
                      <div key={downline.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${downline.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                          <span className="text-white text-sm font-medium">{downline.nickname}</span>
                          <Badge className="text-xs bg-[#2C2F3C] text-[#A0AFC0] border-[#2C2F3C]">
                            {downline.rank}
                          </Badge>
                        </div>
                        <span className="text-[#00E5FF] text-sm font-bold">
                          {downline.revenue.toFixed(2)} USDC
                        </span>
                      </div>
                    ))}
                    {data?.immediateDownlines && data.immediateDownlines.length > 3 && (
                      <div className="text-[#A0AFC0] text-xs text-center pt-2">
                        +{data.immediateDownlines.length - 3} more downlines
                      </div>
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A1E2D",
                        border: "1px solid #2C2F3C",
                        borderRadius: "8px",
                        color: "#A0AFC0",
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
                        backgroundColor: "#1A1E2D",
                        border: "1px solid #2C2F3C",
                        borderRadius: "8px",
                        color: "#A0AFC0",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{
                        color: "#A0AFC0",
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
                      stroke="#A0AFC0" 
                      tick={{ fill: "#A0AFC0", fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#A0AFC0" 
                      tick={{ fill: "#A0AFC0", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A1E2D",
                        border: "1px solid #2C2F3C",
                        borderRadius: "8px",
                        color: "#A0AFC0",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        color: "#A0AFC0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="c1" fill={chartColors.primary} name="C1" />
                    <Bar dataKey="c2" fill={chartColors.secondary} name="C2" />
                    <Bar dataKey="c3" fill={chartColors.tertiary} name="C3" />
                    <Bar dataKey="campaigns" fill={chartColors.accent} name="Campaigns" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="NETWORK GROWTH" description="Your network expansion over time">
              {isError ? (
                <div className="text-red-500">Failed to load chart data.</div>
              ) : (
                <ResponsiveContainer width="100%" height={256}>
                  <LineChart data={(charts as any)?.networkGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2C2F3C" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#A0AFC0" 
                      tick={{ fill: "#A0AFC0", fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#A0AFC0" 
                      tick={{ fill: "#A0AFC0", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A1E2D",
                        border: "1px solid #2C2F3C",
                        borderRadius: "8px",
                        color: "#A0AFC0",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        color: "#A0AFC0",
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
                    <Line
                      type="monotone"
                      dataKey="activeMembers"
                      stroke={chartColors.secondary}
                      strokeWidth={2}
                      dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: chartColors.secondary, strokeWidth: 2 }}
                      name="Active Members"
                    />
                    <Line
                      type="monotone"
                      dataKey="newReferrals"
                      stroke={chartColors.tertiary}
                      strokeWidth={2}
                      dot={{ fill: chartColors.tertiary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: chartColors.tertiary, strokeWidth: 2 }}
                      name="New Referrals"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </ModernSidebar>
  )
}
