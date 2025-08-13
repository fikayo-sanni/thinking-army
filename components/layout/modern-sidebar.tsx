"use client"

import React, { useEffect } from "react"
import Link from "next/link"
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
  Zap,
  BarChart3,
  Menu,
  X,
  DollarSign,
  Search,
} from "lucide-react"
import { useState } from "react"
import { useDashboardStats } from "@/hooks/use-dashboard"
import { useNetworkStats } from "@/hooks/use-network"
import { Skeleton } from "@/components/ui/skeleton"
import { formatThousands } from "@/lib/utils"
import { useQuery } from '@tanstack/react-query'
import { ranksService } from '@/lib/services/ranks-service'
import { useTimeRange } from "@/hooks/use-time-range"
import { cn } from "@/lib/utils"

interface ModernSidebarProps {
  children: React.ReactNode
}

// Update the sidebar styles
const sidebarStyles = {
  base: "bg-[#F8F9FB] dark:bg-[#1E1E1E] border-r border-[#E4E6EB] dark:border-[#2A2A2A]",
  desktop: "w-60 transition-all duration-150 ease-in-out fixed left-0 top-0 h-screen",
  collapsed: "w-14",
  mobile: "w-60",
};

const workspaceHeaderStyles = {
  container: "flex items-center space-x-2 px-3 py-2 mb-4 rounded-md hover:bg-[#F1F3F4] dark:hover:bg-[#1E1E1E] cursor-pointer transition-colors duration-150",
  logo: "h-8 w-8 rounded-md flex items-center justify-center",
  text: "text-[14px] font-semibold text-[#202124] dark:text-[#E6E6E6]",
};

const quickActionsStyles = {
  container: "mb-4 px-3",
  searchBar: "h-9 w-full bg-[#F1F3F4] dark:bg-[#1E1E1E] rounded-md flex items-center px-3 hover:shadow-sm transition-shadow duration-150 cursor-pointer group",
  icon: "h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0] group-hover:text-[#202124] dark:group-hover:text-[#E6E6E6] transition-colors duration-150",
  text: "ml-2 text-[#9AA0A6] dark:text-[#A0A0A0] text-sm italic flex-1",
  shortcut: "text-xs text-[#9AA0A6] dark:text-[#A0A0A0] bg-white/50 dark:bg-[#2A2A2A] px-1.5 py-0.5 rounded",
};

const navigationStyles = {
  container: "px-3 space-y-6",
  section: "space-y-1",
  header: "text-xs font-medium text-[#9AA0A6] dark:text-[#A0A0A0] uppercase tracking-wide mb-2 px-2",
  item: {
    base: "group flex items-center w-full rounded-md px-2 py-1.5 text-sm transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#297EFF] dark:focus-visible:ring-[#4D8DFF]",
    active: "bg-white dark:bg-[#1A2B45] text-[#297EFF] dark:text-[#4D8DFF] shadow-sm",
    inactive: "text-[#202124] dark:text-[#E6E6E6] hover:bg-[#F1F3F4] dark:hover:bg-[#1E1E1E]",
  },
  icon: {
    container: "mr-2 flex-shrink-0",
    active: "text-[#297EFF] dark:text-[#4D8DFF]",
    inactive: "text-[#9AA0A6] dark:text-[#A0A0A0] group-hover:text-[#202124] dark:group-hover:text-[#E6E6E6]",
  },
  text: {
    active: "font-medium text-[#297EFF] dark:text-[#4D8DFF]",
    inactive: "text-[#202124] dark:text-[#E6E6E6]",
  },
  badge: {
    wrapper: "ml-auto",
    default: "bg-[#F1F3F4] text-[#9AA0A6] dark:bg-[#1E1E1E] dark:text-[#A0A0A0]",
    new: "bg-[#297EFF]/10 text-[#297EFF] dark:bg-[#4D8DFF]/10 dark:text-[#4D8DFF]",
  },
  indicator: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#297EFF] dark:bg-[#4D8DFF] rounded-r",
};

const collapseButtonStyles = "w-full justify-center bg-[#F8F9FB] hover:bg-[#EAF3FF] hover:text-[#297EFF] dark:bg-[#1E1E1E] dark:hover:bg-[#1A2B45] dark:hover:text-[#4D8DFF] border border-[#E4E6EB] dark:border-[#2A2A2A] text-[#9AA0A6] dark:text-[#A0A0A0]";

export function ModernSidebar({ children }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Persist sidebar collapsed state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sidebar:collapsed');
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      localStorage.setItem('sidebar:collapsed', String(!prev));
      return !prev;
    });
  };

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

  // Optionally update navigationItems badges with live data
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
      badge: null, // Replace with live data if available
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
    <div className="flex min-h-screen">
      {/* Desktop Sidebar - Fixed */}
      <aside
        className={cn(
          sidebarStyles.base,
          sidebarStyles.desktop,
          isCollapsed && sidebarStyles.collapsed,
          "z-30" // Ensure sidebar is above content
        )}
      >
        {/* Workspace Header */}
        <div className={workspaceHeaderStyles.container}>
          <div className={workspaceHeaderStyles.logo}>
            <img
              src="/logo-dark-mode.svg"
              alt="GC Universe Logo"
              className="h-full w-full hidden dark:block"
            />
            <img
              src="/logo-light-mode.svg"
              alt="GC Universe Logo"
              className="h-full w-full dark:hidden"
            />
          </div>
          {!isCollapsed && (
            <div className="flex items-center flex-1">
              <span className={workspaceHeaderStyles.text}>GC UNIVERSE</span>
              <ChevronRight className="h-4 w-4 ml-auto text-[#9AA0A6] dark:text-[#A0A0A0]" />
            </div>
          )}
        </div>

        {/* Quick Actions Search */}
        {!isCollapsed && (
          <div className={quickActionsStyles.container}>
            <div className={quickActionsStyles.searchBar}>
              <Search className={quickActionsStyles.icon} />
              <span className={quickActionsStyles.text}>Quick actions</span>
              <span className={quickActionsStyles.shortcut}>⌘K</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {/* Navigation */}
          <nav className={navigationStyles.container}>
            <div className={navigationStyles.section}>
              <div className={navigationStyles.header}>
                {isCollapsed ? "•••" : "Navigation"}
              </div>
              {navigationItemsLive.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        navigationStyles.item.base,
                        isActive ? navigationStyles.item.active : navigationStyles.item.inactive,
                        "relative"
                      )}
                    >
                      <div className={navigationStyles.icon.container}>
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            isActive ? navigationStyles.icon.active : navigationStyles.icon.inactive
                          )}
                        />
                      </div>
                      {!isCollapsed && (
                        <>
                          <span
                            className={cn(
                              isActive ? navigationStyles.text.active : navigationStyles.text.inactive
                            )}
                          >
                            {item.name}
                          </span>
                          {item.badge && (
                            <div className={navigationStyles.badge.wrapper}>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs px-1.5 py-0.5 rounded",
                                  item.badge === "New"
                                    ? navigationStyles.badge.new
                                    : navigationStyles.badge.default
                                )}
                              >
                                {item.badge}
                              </Badge>
                            </div>
                          )}
                        </>
                      )}
                      {isActive && <div className={navigationStyles.indicator} />}
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Collapse Button */}
        {/*<div className="p-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleCollapse}
            className="w-full justify-center bg-white hover:bg-[#F1F3F4] dark:bg-[#1E1E1E] dark:hover:bg-[#1A2B45] border-[#E4E6EB] dark:border-[#2A2A2A] text-[#9AA0A6] dark:text-[#A0A0A0] h-8"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-150",
                isCollapsed ? "rotate-0" : "rotate-180"
              )}
            />
            {!isCollapsed && <span className="ml-2 text-sm">Collapse</span>}
          </Button>
        </div>*/}
      </aside>

      {/* Main Content Area - With padding for sidebar */}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-150 ease-in-out",
        isCollapsed ? "pl-14" : "pl-60" // Match sidebar width
      )}>
        {children}
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#202124]/40 dark:bg-black/40 backdrop-blur-sm flex" onClick={() => setIsMobileOpen(false)}>
          <aside
            className={cn(
              sidebarStyles.base,
              sidebarStyles.mobile,
              "h-screen flex flex-col min-h-0"
            )}
            onClick={e => e.stopPropagation()}
          >
            {/* Logo Section */}
            <div className={workspaceHeaderStyles.container}>
              <div className={workspaceHeaderStyles.logo}>
                <img
                  src="/logo-dark-mode.svg"
                  alt="GC Universe Logo"
                  className="h-full w-full hidden dark:block"
                />
                <img
                  src="/logo-light-mode.svg"
                  alt="GC Universe Logo"
                  className="h-full w-full dark:hidden"
                />
              </div>
              <div className="flex items-center flex-1">
                <span className={workspaceHeaderStyles.text}>GC UNIVERSE</span>
                <ChevronRight className="h-4 w-4 ml-auto text-[#9AA0A6] dark:text-[#A0A0A0]" />
              </div>
            </div>

            {/* Quick Actions Search */}
            <div className={quickActionsStyles.container}>
              <div className={quickActionsStyles.searchBar}>
                <Search className={quickActionsStyles.icon} />
                <span className={quickActionsStyles.text}>Quick actions</span>
                <span className={quickActionsStyles.shortcut}>⌘K</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className={navigationStyles.container}>
              <div className={navigationStyles.section}>
                <div className={navigationStyles.header}>
                  Navigation
                </div>
                {navigationItemsLive.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                      <div
                        className={cn(
                          navigationStyles.item.base,
                          isActive ? navigationStyles.item.active : navigationStyles.item.inactive,
                          "relative"
                        )}
                      >
                        <div className={navigationStyles.icon.container}>
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              isActive ? navigationStyles.icon.active : navigationStyles.icon.inactive
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            isActive ? navigationStyles.text.active : navigationStyles.text.inactive
                          )}
                        >
                          {item.name}
                        </span>
                        {item.badge && (
                          <div className={navigationStyles.badge.wrapper}>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded",
                                item.badge === "New"
                                  ? navigationStyles.badge.new
                                  : navigationStyles.badge.default
                              )}
                            >
                              {item.badge}
                            </Badge>
                          </div>
                        )}
                        {isActive && <div className={navigationStyles.indicator} />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>
        </div>
      )}
    </div>
  )
}
