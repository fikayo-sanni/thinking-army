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

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState("last-week")
  const { data, isLoading, isError } = useDashboardData(timeFilter)

  // Extract data safely
  const overview = data?.overview
  const stats = data?.stats
  const charts = data?.charts

  if (isLoading) {
    return (
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6 space-y-6">
            <PageHeader title="DASHBOARD" description="Overview of your account and activity" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <MetricCard
                title="RANK PROGRESS"
                value={overview?.recentActivity?.[0]?.description?.toUpperCase() || "GOLD"}
                icon={Trophy}
                progress={{ value: stats?.monthlyGrowth ?? 0, label: "To Platinum" }}
              />
              <MetricCard
                title="DOWNLINE GROWTH"
                value={stats?.totalNetworkSize ?? 0}
                icon={Users}
                change={{ value: `+${stats?.monthlyGrowth ?? 0}`, type: "positive" }}
              />
            </div>
          )}

          {/* Middle Section - 2 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="PURCHASES OVER TIME" description="Your NFT purchase activity">
              {isError ? (
                <div className="text-red-500">Failed to load chart data.</div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[#A0AFC0]">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Line Chart - Purchases Over Time</p>
                    <p className="text-sm">Chart implementation coming soon</p>
                  </div>
                </div>
              )}
            </ChartCard>

            <ChartCard title="COMMISSION SOURCES" description="Breakdown of commission types">
              {isError ? (
                <div className="text-red-500">Failed to load chart data.</div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[#A0AFC0]">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Donut Chart - Commission Sources</p>
                    <p className="text-sm">Chart implementation coming soon</p>
                  </div>
                </div>
              )}
            </ChartCard>
          </div>

          {/* Bottom Section - 2 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="COMMISSION BREAKDOWN" description="Detailed commission analysis">
              {isError ? (
                <div className="text-red-500">Failed to load chart data.</div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[#A0AFC0]">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Bar Chart - Commission Breakdown</p>
                    <p className="text-sm">Chart implementation coming soon</p>
                  </div>
                </div>
              )}
            </ChartCard>

            <ChartCard title="NETWORK GROWTH" description="Your network expansion over time">
              {isError ? (
                <div className="text-red-500">Failed to load chart data.</div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[#A0AFC0]">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Line Chart - Network Growth</p>
                    <p className="text-sm">Chart implementation coming soon</p>
                  </div>
                </div>
              )}
            </ChartCard>
          </div>
        </div>
      </div>
    </ModernSidebar>
  )
}
