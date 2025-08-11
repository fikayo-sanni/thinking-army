"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Zap,
  BarChart3,
  DollarSign,
} from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard"
import { useNetworkStats } from "@/hooks/use-network"
import { Skeleton } from "@/components/ui/skeleton"
import { formatThousands } from "@/lib/utils"
import { useQuery } from '@tanstack/react-query'
import { ranksService } from '@/lib/services/ranks-service'
import { useTimeRange } from "@/hooks/use-time-range"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { state, setOpenMobile, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Handle navigation click for mobile - close sidebar
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  // 🚀 OPTIMIZED: Only fetch stats if sidebar is expanded (reduce API calls)
  const [timeRange] = useTimeRange("this-week")
  const { data: dashboardStats, isLoading: isDashboardLoading } = useDashboardStats(timeRange, {
    enabled: !isCollapsed, // Only fetch when sidebar is visible
    staleTime: 10 * 60 * 1000, // Increase cache time to 10 minutes
    gcTime: 20 * 60 * 1000, // Keep in cache for 20 minutes
  });
  const { data: networkStats, isLoading: isNetworkLoading } = useNetworkStats(timeRange, {
    enabled: !isCollapsed, // Only fetch when sidebar is visible
    staleTime: 10 * 60 * 1000, // Increase cache time to 10 minutes
    gcTime: 20 * 60 * 1000, // Keep in cache for 20 minutes
  });

  // 🚀 OPTIMIZED: Fetch current rank with longer cache and only when needed
  const { data: currentRankData, isLoading: isCurrentRankLoading } = useQuery({
    queryKey: ['current-rank'],
    queryFn: () => ranksService.getCurrentRank(),
    enabled: !isCollapsed, // Only fetch when sidebar is visible
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes (ranks don't change often)
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Prepare live quick stats
  const quickStats = [
    {
      label: "AllTime VP",
      value: isDashboardLoading ? <Skeleton className="h-4 w-16 dark:bg-[#2C2F3C] rounded" /> : `${formatThousands((dashboardStats as any)?.personalEarnings?.toFixed(0) ?? 0)} VP`,
      icon: TrendingUp,
      color: "text-[#0846A6]",
    },
    {
      label: "Active Downlines", 
      value: isNetworkLoading ? <Skeleton className="h-4 w-8 dark:bg-[#2C2F3C] rounded" /> : `${formatThousands((networkStats as any)?.activeMembers?.toLocaleString() ?? 0)}/${formatThousands((networkStats as any)?.totalDirectDownlines || 0)}`,
      icon: Users,
      color: "text-[#00B28C]",
    },
    {
      label: "Current Rank",
      value: isCurrentRankLoading
        ? <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
        : <RankBadge rank={currentRankData?.name || "STARTER"} size="sm" showIcon={false} />,
      icon: Trophy,
      color: "text-[#FFD700]",
    },
    {
      label: "Own Turnover",
      value: isDashboardLoading
        ? <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
        : formatThousands((dashboardStats as any)?.ownTurnover?.toFixed(2) ?? 0),
      icon: DollarSign,
      color: "text-green-800",
    },
  ];

  // Navigation items with live data
  const navigationItemsLive = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
      gradient: "from-[#0846A6] to-[#0099CC]",
    },
    {
      name: "Network Activity",
      href: "/purchases",
      icon: ShoppingCart,
      badge: null,
      gradient: "from-[#00B28C] to-[#00CC99]",
    },
    {
      name: "My Network",
      href: "/network",
      icon: Users,
      badge: isNetworkLoading ? null : (networkStats as any)?.totalDownlines?.toLocaleString() ?? null,
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

  return (
    <Sidebar className="border-r border-[#E5E7EB] dark:border-[#E5E7EB]/50 bg-white dark:bg-[#1A1E2D]">
      <SidebarHeader className="p-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center">
              <img
                src="/logo-dark-mode.svg"
                alt="GC Universe Logo"
                className="h-20 w-20 hidden dark:block"
              />
              <img
                src="/logo-light-mode.svg"
                alt="GC Universe Logo"
                className="h-20 w-20 dark:hidden"
              />
            </div>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-2xl dark:text-white font-bold">
                GC UNIVERSE
              </h1>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-6">
        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="mb-8 p-4 rounded-2xl backdrop-blur bg-white border-[#E5E7EB] dark:border-none dark:bg-[#1A1E2D]">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-[#0846A6]" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="dark:text-[#A0AFC0] text-gray-700 text-sm">{stat.label}</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold text-sm">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="dark:text-[#A0AFC0] text-gray-700 text-xs uppercase tracking-wider font-semibold mb-4 px-3">
            {isCollapsed ? "•••" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItemsLive.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`group relative dark:text-[#A0AFC0] text-gray-700 flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${isActive
                        ? "bg-[#E9ECF0] dark:bg-gradient-to-r dark:from-[#0846A6]/20 dark:to-[#6F00FF]/20 border-none dark:border-[#0846A6]/30 shadow-lg shadow-[#0846A6]/10"
                        : "hover:bg-[#E9ECF0] dark:hover:bg-[#1A1E2D]/60 dark:hover:border dark:hover:border-[#E5E7EB]/50"
                        }`}
                    >
                      <Link href={item.href} onClick={handleNavClick}>
                        <div className="flex items-center space-x-3 w-full">
                          <div
                            className={`relative p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${item.gradient}` : "bg-[#D9D9D9] dark:bg-[#2C2F3C]/50 dark:group-hover:bg-[#2C2F3C]"} transition-all duration-200`}
                          >
                            <item.icon
                              className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-700 dark:text-[#A0AFC0] group-hover:text-white"}`}
                            />
                          </div>
                          {!isCollapsed && (
                            <>
                              <div className="flex-1">
                                <span
                                  className={`font-medium dark:text-[#A0AFC0] text-gray-700 text-sm ${isActive ? "text-gray-900 dark:text-white" : "text-[#A0AFC0] group-hover:text-white"}`}
                                >
                                  {item.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {item.badge && (
                                  <Badge
                                    className={`text-xs px-2 py-0.5 ${item.badge === "New"
                                      ? "bg-[#00B28C]/20 text-[#00B28C] border-[#00B28C]/30"
                                      : "bg-[#2C2F3C] text-[#A0AFC0]"
                                      }`}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                                {isActive && <ChevronRight className="h-4 w-4 text-gray-700  dark:text-[#0846A6]" />}
                              </div>
                            </>
                          )}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#0846A6] to-[#6F00FF] rounded-r-full" />
                          )}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
} 