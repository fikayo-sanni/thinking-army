"use client"

import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { MetricCard } from "@/components/ui/metric-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { TrendingUp, Users, Coins, Trophy, BarChart3, PieChart } from "lucide-react"

// Mock data
const metrics = {
  totalPurchases: 156,
  totalCommissions: 45.7,
  rankProgress: 75,
  downlineGrowth: 234,
}

export default function DashboardPage() {
  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="DASHBOARD" description="Overview of your NFT sales performance" />

          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="TOTAL PURCHASES"
              value={metrics.totalPurchases}
              icon={TrendingUp}
              change={{ value: "+12%", type: "positive" }}
            />
            <MetricCard
              title="TOTAL COMMISSIONS"
              value={`${metrics.totalCommissions} ETH`}
              icon={Coins}
              change={{ value: "+8%", type: "positive" }}
            />
            <MetricCard
              title="RANK PROGRESS"
              value="GOLD"
              icon={Trophy}
              progress={{ value: metrics.rankProgress, label: "To Platinum" }}
            />
            <MetricCard
              title="DOWNLINE GROWTH"
              value={metrics.downlineGrowth}
              icon={Users}
              change={{ value: "+15", type: "positive" }}
            />
          </div>

          {/* Middle Section - 2 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="PURCHASES OVER TIME" description="Your NFT purchase activity">
              <div className="h-64 flex items-center justify-center text-[#A0AFC0]">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Line Chart - Purchases Over Time</p>
                  <p className="text-sm">Chart implementation coming soon</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="COMMISSION SOURCES" description="Breakdown of commission types">
              <div className="h-64 flex items-center justify-center text-[#A0AFC0]">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Donut Chart - Commission Sources</p>
                  <p className="text-sm">Chart implementation coming soon</p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Bottom Section - 2 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="COMMISSION BREAKDOWN" description="Detailed commission analysis">
              <div className="h-64 flex items-center justify-center text-[#A0AFC0]">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Bar Chart - Commission Breakdown</p>
                  <p className="text-sm">Chart implementation coming soon</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="NETWORK GROWTH" description="Your network expansion over time">
              <div className="h-64 flex items-center justify-center text-[#A0AFC0]">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Line Chart - Network Growth</p>
                  <p className="text-sm">Chart implementation coming soon</p>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </ModernSidebar>
  )
}
