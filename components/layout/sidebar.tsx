"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Coins,
  LayoutDashboard,
  ShoppingCart,
  Users,
  TrendingUp,
  Trophy,
  Wallet,
  Menu,
  X,
  Bell,
  Settings,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const navigationItems = [
  {
    name: "DASHBOARD",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "PURCHASES",
    href: "/purchases",
    icon: ShoppingCart,
  },
  {
    name: "MY NETWORK",
    href: "/network",
    icon: Users,
  },
  {
    name: "COMMISSIONS",
    href: "/commissions",
    icon: TrendingUp,
  },
  {
    name: "RANKS",
    href: "/ranks",
    icon: Trophy,
  },
  {
    name: "PAYOUTS",
    href: "/payouts",
    icon: Wallet,
  },
]

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#2C2F3C] bg-[#0D0F1A]">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-[#00E5FF] flex items-center justify-center">
            <img src="/GCs.svg" alt="Gamescoin Logo" className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">GAMESCOIN</h1>
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
            isCollapsed ? "w-16" : "w-64"
          } transition-all duration-200 border-r border-[#2C2F3C] bg-[#0D0F1A] min-h-screen sticky top-0 hidden lg:block`}
        >
          <div className="p-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-10 w-10 rounded-lg bg-[#00E5FF] flex items-center justify-center">
                <img src="/GCs.svg" alt="Gamescoin Logo" className="h-6 w-6" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold tracking-wide">GAMESCOIN</h1>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#1A1E2D] border border-[#00E5FF] text-white"
                          : "hover:bg-[#1A1E2D] text-[#A0AFC0] hover:text-white"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? "text-[#00E5FF]" : ""}`} />
                      {!isCollapsed && (
                        <>
                          <span className={`font-medium text-sm tracking-wide ${isActive ? "text-white" : ""}`}>
                            {item.name}
                          </span>
                          {isActive && <ChevronRight className="h-4 w-4 text-[#00E5FF] ml-auto" />}
                        </>
                      )}
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-[#A0AFC0] hover:text-white hover:bg-[#1A1E2D]"
              >
                <Menu className="h-4 w-4" />
              </Button>
              {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-[#A0AFC0] hover:text-white hover:bg-[#1A1E2D]">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-[#A0AFC0] hover:text-white hover:bg-[#1A1E2D]">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-8 w-8 ring-2 ring-[#2C2F3C]">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-[#1A1E2D] text-[#00E5FF]">GC</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <aside className="w-64 bg-[#0D0F1A] border-r border-[#2C2F3C] min-h-screen">
              <div className="p-4">
                {/* Logo Section */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="h-10 w-10 rounded-lg bg-[#00E5FF] flex items-center justify-center">
                    <img src="/GCs.svg" alt="Gamescoin Logo" className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-wide">GAMESCOIN</h1>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
                        <div
                          className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                            isActive
                              ? "bg-[#1A1E2D] border border-[#00E5FF] text-white"
                              : "hover:bg-[#1A1E2D] text-[#A0AFC0] hover:text-white"
                          }`}
                        >
                          <item.icon className={`h-5 w-5 ${isActive ? "text-[#00E5FF]" : ""}`} />
                          <span className={`font-medium text-sm tracking-wide ${isActive ? "text-white" : ""}`}>
                            {item.name}
                          </span>
                          {isActive && <ChevronRight className="h-4 w-4 text-[#00E5FF] ml-auto" />}
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Bottom Section */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <Avatar className="h-8 w-8 ring-2 ring-[#2C2F3C]">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-[#1A1E2D] text-[#00E5FF]">GC</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-[#A0AFC0] hover:text-white hover:bg-[#1A1E2D]">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#A0AFC0] hover:text-white hover:bg-[#1A1E2D]">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
