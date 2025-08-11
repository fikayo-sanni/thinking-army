"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Bell, Settings, User, LogOut, Wallet, TrendingUp, Gift, MessageSquare, Sun, Moon, Menu } from "lucide-react"
import Link from "next/link"
import { useAuth, useAuth as useAuthProvider } from "@/lib/auth/AuthProvider"
import { useRouter } from 'next/navigation'
import { useTheme } from "@/components/theme/theme-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { SidebarTrigger } from "@/components/ui/sidebar"

const notifications = [
  {
    id: 1,
    type: "commission",
    title: "New Commission Earned",
    message: "You earned 0.25 ETH from Emma Wilson's purchase",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "rank",
    title: "Rank Progress Update",
    message: "You're 75% towards Platinum rank",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "payout",
    title: "Payout Completed",
    message: "Your withdrawal of 5.25 ETH has been processed",
    time: "3 hours ago",
    unread: false,
  },
]

export function ModernHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const unreadCount = notifications.filter((n) => n.unread).length
  const { logout, user } = useAuth()
  // console.log(user) // Removed for performance
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "commission":
        return <TrendingUp className="h-4 w-4 text-[#0846A6]" />
      case "rank":
        return <Gift className="h-4 w-4 text-[#6F00FF]" />
      case "payout":
        return <Wallet className="h-4 w-4 text-[#00B28C]" />
      default:
        return <MessageSquare className="h-4 w-4 text-[#A0AFC0]" />
    }
  }

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  return (
    <header className="flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 bg-[#F9FAFC] dark:bg-[#1A1E2D] border-b border-[#E5E7EB] dark:border-[#E5E7EB]">
      {/* Mobile Layout */}
      <div className="flex items-center justify-between w-full lg:hidden">
        {/* Left side - Menu button */}
        <SidebarTrigger className="h-10 w-10 rounded-full dark:bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#E5E7EB]/50" />

        {/* Center - Logo/Title could go here if needed */}
        <div className="flex-1" />

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full dark:bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#E5E7EB]/50"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-[#A0AFC0]" />
            ) : (
              <Moon className="h-5 w-5 text-[#A0AFC0]" />
            )}
          </Button>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="h-10 w-10 rounded-full dark:bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#E5E7EB]/50"
          >
            <Search className="h-5 w-5 text-[#A0AFC0]" />
          </Button>

          {/* Notifications */}
          {/*<Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 w-10 rounded-full dark:bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#E5E7EB]/50"
              >
                <Bell className="h-5 w-5 text-[#A0AFC0]" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#0846A6] dark:bg-[#0846A6] text-[#FFFFFF] dark:text-black text-xs p-0 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 dark:bg-[#1A1E2D] dark:border-[#E5E7EB] p-0" align="end">
              <div className="p-4 dark:border-b border-[#E5E7EB]">
                <h3 className="text-white font-semibold">Notifications</h3>
                <p className="text-[#A0AFC0] text-sm">{unreadCount} unread notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[#E5E7EB]/50 hover:bg-[#2C2F3C]/20 cursor-pointer ${
                      notification.unread ? "bg-[#0846A6]/5" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium truncate">{notification.title}</p>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-[#0846A6] rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-[#A0AFC0] text-xs mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-[#A0AFC0] text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 dark:border-[#E5E7EB]">
                <Button variant="ghost" className="w-full text-[#0846A6] hover:bg-[#0846A6]/10 text-sm">
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>*/}

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 ring-2 ring-[#0846A6]/20 hover:ring-[#0846A6]/40 transition-all">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-[#0846A6] to-[#6F00FF] text-black font-bold text-sm">
                    GC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB]" align="end">
              <DropdownMenuItem className="dark:text-[#A0AFC0] hover:text-white hover:bg-[#2C2F3C]" asChild>
                <Link href="/profile-settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-[#E5E7EB]" />
              <DropdownMenuItem 
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
              {/*<DropdownMenuItem className="dark:text-[#A0AFC0] hover:text-white hover:bg-[#2C2F3C]" asChild>
                <Link href="/wallet-settings">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet Settings
                </Link>
              </DropdownMenuItem>*/}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Search Section */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A0AFC0]" />
            <Input
              placeholder="Search transactions, users, or NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-[#1A1E2D]/50 dark:border-[#E5E7EB] text-white placeholder-[white] focus:border-[#0846A6] focus:ring-1 focus:ring-[#0846A6] h-10"
            />
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full dark:bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#E5E7EB]/50"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-[#A0AFC0]" />
            ) : (
              <Moon className="h-5 w-5 text-[#A0AFC0]" />
            )}
          </Button>

          {/* Notifications */}
          {/*<Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 w-10 rounded-full dark:bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#E5E7EB]/50"
              >
                <Bell className="h-5 w-5 text-[#A0AFC0]" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#0846A6] dark:bg-[#0846A6] text-[#FFFFFF] dark:text-black text-xs p-0 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 dark:bg-[#1A1E2D] dark:border-[#E5E7EB] p-0" align="end">
              <div className="p-4 dark:border-b border-[#E5E7EB]">
                <h3 className="text-white font-semibold">Notifications</h3>
                <p className="text-[#A0AFC0] text-sm">{unreadCount} unread notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[#E5E7EB]/50 hover:bg-[#2C2F3C]/20 cursor-pointer ${
                      notification.unread ? "bg-[#0846A6]/5" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium truncate">{notification.title}</p>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-[#0846A6] rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-[#A0AFC0] text-xs mt-1">{notification.message}</p>
                        <p className="text-[#A0AFC0] text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 dark:border-[#E5E7EB]">
                <Button variant="ghost" className="w-full text-[#0846A6] hover:bg-[#0846A6]/10">
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>*/}



          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 ring-2 ring-[#0846A6]/20 hover:ring-[#0846A6]/40 transition-all">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-[#0846A6] to-[#6F00FF] text-black font-bold">
                    GC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB]" align="end">
              <DropdownMenuItem className="dark:text-[#A0AFC0] hover:text-white hover:bg-[#2C2F3C]" asChild>
                <Link href="/profile-settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-[#E5E7EB]" />
              <DropdownMenuItem 
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
              {/*<DropdownMenuItem className="dark:text-[#A0AFC0] hover:text-white hover:bg-[#2C2F3C]" asChild>
                <Link href="/wallet-settings">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet Settings
                </Link>
              </DropdownMenuItem>*/}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 right-0 z-50 lg:hidden bg-[#F9FAFC] dark:bg-[#1A1E2D] border-b border-[#E5E7EB] dark:border-[#E5E7EB] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A0AFC0]" />
            <Input
              placeholder="Search transactions, users, or NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-[#1A1E2D]/50 dark:border-[#E5E7EB] text-white placeholder-[#A0AFC0] focus:border-[#0846A6] focus:ring-1 focus:ring-[#0846A6] h-12"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}

/**
  <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() =>handleLogout}>
                Sign Out
              </DropdownMenuItem>
 */
