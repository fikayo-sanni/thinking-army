"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Coins,
  LayoutDashboard,
  ShoppingCart,
  Users,
  TrendingUp,
  Trophy,
  Wallet,
  ChevronRight,
  Zap,
  BarChart3,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { useDashboardStats } from "@/hooks/use-dashboard"
import { useNetworkStats } from "@/hooks/use-network"
import { Skeleton } from "@/components/ui/skeleton"
import { formatThousands } from "@/lib/utils"
import { useQuery } from '@tanstack/react-query'
import { ranksService } from '@/lib/services/ranks-service'

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
    gradient: "from-[#00E5FF] to-[#0099CC]",
  },
  {
    name: "Network Purchases",
    href: "/purchases",
    icon: ShoppingCart,
    badge: "156",
    gradient: "from-[#00FFC8] to-[#00CC99]",
  },
  {
    name: "My Network",
    href: "/network",
    icon: Users,
    badge: "12",
    gradient: "from-[#6F00FF] to-[#5500CC]",
  },
  {
    name: "Commissions",
    href: "/commissions",
    icon: TrendingUp,
    badge: null,
    gradient: "from-[#FFD700] to-[#FFA500]",
  },
  {
    name: "Ranks",
    href: "/ranks",
    icon: Trophy,
    badge: null,
    gradient: "from-[#6B7280] to-[#4B5563]",
  },
  {
    name: "Payouts",
    href: "/payouts",
    icon: Wallet,
    badge: null,
    gradient: "from-[#4ECDC4] to-[#26A69A]",
  },
]

interface ModernSidebarProps {
  children: React.ReactNode
}

export function ModernSidebar({ children }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Fetch live stats
  const { data: dashboardStats, isLoading: isDashboardLoading } = useDashboardStats();
  const { data: networkStats, isLoading: isNetworkLoading } = useNetworkStats();

  // Fetch current rank using React Query
  const { data: currentRankData, isLoading: isCurrentRankLoading } = useQuery({
    queryKey: ['current-rank'],
    queryFn: () => ranksService.getCurrentRank(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Prepare live quick stats
  const quickStats = [
    {
      label: "AllTime VP",
      value: isDashboardLoading ? <Skeleton className="h-4 w-16 bg-[#2C2F3C] rounded" /> : `${formatThousands(dashboardStats?.personalEarnings?.toFixed(2) ?? 0)} VP`,
      icon: TrendingUp,
      color: "text-[#00E5FF]",
    },
    {
      label: "Active Downlines",
      value: isNetworkLoading ? <Skeleton className="h-4 w-8 bg-[#2C2F3C] rounded" /> : `${formatThousands(networkStats?.activeMembers?.toLocaleString() ?? 0)}/${formatThousands(networkStats?.totalDownlines || 0)}`,
      icon: Users,
      color: "text-[#00FFC8]",
    },
    {
      label: "Current Rank",
      value: isCurrentRankLoading
        ? <Skeleton className="h-4 w-12 bg-[#2C2F3C] rounded" />
        : (currentRankData?.name.split(" Member")[0] || "Member"),
      icon: Trophy,
      color: "text-[#FFD700]",
    },
  ];

  // Optionally update navigationItems badges with live data
  const navigationItemsLive = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
      gradient: "from-[#00E5FF] to-[#0099CC]",
    },
    {
      name: "Network Activity",
      href: "/purchases",
      icon: ShoppingCart,
      badge: null, // Replace with live data if available
      gradient: "from-[#00FFC8] to-[#00CC99]",
    },
    {
      name: "My Network",
      href: "/network",
      icon: Users,
      badge: isNetworkLoading ? null : networkStats?.totalDownlines?.toLocaleString() ?? null,
      gradient: "from-[#6F00FF] to-[#5500CC]",
    },
    {
      name: "Commissions",
      href: "/commissions",
      icon: TrendingUp,
      badge: null,
      gradient: "from-[#FFD700] to-[#FFA500]",
    },
    {
      name: "Ranks",
      href: "/ranks",
      icon: Trophy,
      badge: null,
      gradient: "from-[#6B7280] to-[#4B5563]",
    },
    {
      name: "Payouts",
      href: "/payouts",
      icon: Wallet,
      badge: null,
      gradient: "from-[#4ECDC4] to-[#26A69A]",
    },
  ];

  // Prevent background scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  return (
    <div className="min-h-screen bg-[#F9FAFC] dark:bg-gradient-to-br dark:from-[#0D0F1A] dark:via-[#1A1E2D] dark:to-[#0D0F1A] text-black dark:text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1A1E2D]">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 flex items-center justify-center">
            <img src="/logo-dark-mode.svg" alt="GC Universe Logo" className="h-20 w-20" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-[#A0AFC0] bg-clip-text text-transparent">
              GC UNIVERSE
            </h1>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-[#A0AFC0] hover:text-white hover:bg-[#1A1E2D]"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`${
            isCollapsed ? "w-20" : "w-80"
          } transition-all duration-300 ease-in-out bg-[#F9FAFC] dark:bg-[#0D0F1A]/90 backdrop-blur-xl border-r border-[#E5E7EB] dark:border-[#2C2F3C]/50 min-h-screen sticky top-0 hidden lg:block text-black dark:text-white`}
        >
          <div className="p-6">
            {/* Logo Section */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center">
                  <img src="/logo-dark-mode.svg" alt="Gamescoin Logo" className="h-20 w-20" />
                </div>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#A0AFC0] bg-clip-text text-transparent">
                    GC UNIVERSE
                  </h1>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {!isCollapsed && (
              <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-[#1A1E2D]/80 to-[#2C2F3C]/40 backdrop-blur border border-[#2C2F3C]/50">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-[#00E5FF]" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        <span className="text-[#A0AFC0] text-sm">{stat.label}</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2">
              <div className="text-[#A0AFC0] text-xs uppercase tracking-wider font-semibold mb-4 px-3">
                {isCollapsed ? "•••" : "Navigation"}
              </div>
              {navigationItemsLive.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`group relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#00E5FF]/20 to-[#6F00FF]/20 border border-[#00E5FF]/30 shadow-lg shadow-[#00E5FF]/10"
                          : "hover:bg-[#1A1E2D]/60 hover:border hover:border-[#2C2F3C]/50"
                      }`}
                    >
                      <div
                        className={`relative p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${item.gradient}` : "bg-[#2C2F3C]/50 group-hover:bg-[#2C2F3C]"} transition-all duration-200`}
                      >
                        <item.icon
                          className={`h-5 w-5 ${isActive ? "text-white" : "text-[#A0AFC0] group-hover:text-white"}`}
                        />
                      </div>
                      {!isCollapsed && (
                        <>
                          <div className="flex-1">
                            <span
                              className={`font-medium text-sm ${isActive ? "text-white" : "text-[#A0AFC0] group-hover:text-white"}`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <Badge
                                className={`text-xs px-2 py-0.5 ${
                                  item.badge === "New"
                                    ? "bg-[#00FFC8]/20 text-[#00FFC8] border-[#00FFC8]/30"
                                    : "bg-[#2C2F3C] text-[#A0AFC0]"
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {isActive && <ChevronRight className="h-4 w-4 text-[#00E5FF]" />}
                          </div>
                        </>
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#00E5FF] to-[#6F00FF] rounded-r-full" />
                      )}
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full justify-center bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#2C2F3C]/50 text-[#A0AFC0] hover:text-white"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "rotate-0" : "rotate-180"}`}
              />
              {!isCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex" onClick={() => setIsMobileOpen(false)}>
            <aside
              className="w-4/5 max-w-xs bg-[#0D0F1A]/95 backdrop-blur-xl border-r border-[#2C2F3C]/50 min-h-screen"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Logo Section */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center">
                      <img src="/logo-dark-mode.svg" alt="Gamescoin Logo" className="h-20 w-20" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#A0AFC0] bg-clip-text text-transparent">
                      GC UNIVERSE
                    </h1>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-[#1A1E2D]/80 to-[#2C2F3C]/40 backdrop-blur border border-[#2C2F3C]/50">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-[#00E5FF]" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    {quickStats.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <stat.icon className={`h-4 w-4 ${stat.color}`} />
                          <span className="text-[#A0AFC0] text-sm">{stat.label}</span>
                        </div>
                        <span className="text-white font-semibold text-sm">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <div className="text-[#A0AFC0] text-xs uppercase tracking-wider font-semibold mb-4 px-3">
                    Navigation
                  </div>
                  {navigationItemsLive.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                        <div
                          className={`group relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-[#00E5FF]/20 to-[#6F00FF]/20 border border-[#00E5FF]/30 shadow-lg shadow-[#00E5FF]/10"
                              : "hover:bg-[#1A1E2D]/60 hover:border hover:border-[#2C2F3C]/50"
                          }`}
                        >
                          <div
                            className={`relative p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${item.gradient}` : "bg-[#2C2F3C]/50 group-hover:bg-[#2C2F3C]"} transition-all duration-200`}
                          >
                            <item.icon
                              className={`h-5 w-5 ${isActive ? "text-white" : "text-[#A0AFC0] group-hover:text-white"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <span
                              className={`font-medium text-sm ${isActive ? "text-white" : "text-[#A0AFC0] group-hover:text-white"}`}
                            >
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <Badge
                                className={`text-xs px-2 py-0.5 ${
                                  item.badge === "New"
                                    ? "bg-[#00FFC8]/20 text-[#00FFC8] border-[#00FFC8]/30"
                                    : "bg-[#2C2F3C] text-[#A0AFC0]"
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {isActive && <ChevronRight className="h-4 w-4 text-[#00E5FF]" />}
                          </div>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#00E5FF] to-[#6F00FF] rounded-r-full" />
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">{children}</main>
      </div>
    </div>
  )
}
