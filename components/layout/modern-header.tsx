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
import { Search, Bell, Settings, User, LogOut, Wallet, TrendingUp, Gift, MessageSquare, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useTheme } from "@/components/theme/theme-provider"

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
  const unreadCount = notifications.filter((n) => n.unread).length
  const { logout } = useAuth()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "commission":
        return <TrendingUp className="h-4 w-4 text-[#00E5FF]" />
      case "rank":
        return <Gift className="h-4 w-4 text-[#6F00FF]" />
      case "payout":
        return <Wallet className="h-4 w-4 text-[#00FFC8]" />
      default:
        return <MessageSquare className="h-4 w-4 text-[#A0AFC0]" />
    }
  }

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <header className="h-16 bg-[#0D0F1A]/80 backdrop-blur-xl border-b border-[#2C2F3C]/50 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search Section */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A0AFC0]" />
            <Input
              placeholder="Search transactions, users, or NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1A1E2D]/50 border-[#2C2F3C] text-white placeholder-[white] focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] h-10"
            />
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 w-10 rounded-full bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#2C2F3C]/50"
              >
                <Bell className="h-5 w-5 text-[#A0AFC0]" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#00E5FF] text-black text-xs p-0 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#1A1E2D] border-[#2C2F3C] p-0" align="end">
              <div className="p-4 border-b border-[#2C2F3C]">
                <h3 className="text-white font-semibold">Notifications</h3>
                <p className="text-[#A0AFC0] text-sm">{unreadCount} unread notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-[#2C2F3C]/50 hover:bg-[#2C2F3C]/20 cursor-pointer ${
                      notification.unread ? "bg-[#00E5FF]/5" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-medium truncate">{notification.title}</p>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-[#00E5FF] rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-[#A0AFC0] text-xs mt-1">{notification.message}</p>
                        <p className="text-[#A0AFC0] text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[#2C2F3C]">
                <Button variant="ghost" className="w-full text-[#00E5FF] hover:bg-[#00E5FF]/10">
                  View All Notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Settings */}
          <Link href="/preferences">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full bg-[#1A1E2D]/50 hover:bg-[#2C2F3C]/50 border border-[#2C2F3C]/50"
            >
              <Settings className="h-5 w-5 text-[#A0AFC0]" />
            </Button>
          </Link>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 ring-2 ring-[#00E5FF]/20 hover:ring-[#00E5FF]/40 transition-all">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-[#00E5FF] to-[#6F00FF] text-black font-bold">
                    GC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1A1E2D] border-[#2C2F3C]" align="end">
              <DropdownMenuLabel className="text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-[#A0AFC0]">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2C2F3C]" />
              <DropdownMenuItem className="text-[#A0AFC0] hover:text-white hover:bg-[#2C2F3C]" asChild>
                <Link href="/profile-settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#A0AFC0] hover:text-white hover:bg-[#2C2F3C]" asChild>
                <Link href="/wallet-settings">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#A0AFC0] hover:text-white hover:bg-[#2C2F3C]" asChild>
                <Link href="/preferences">
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2C2F3C]" />
              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={handleLogout} className="ml-4">
            Logout
          </Button>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[#F7F8F8] dark:bg-[#2C2F3C] hover:bg-[#F9FAFC] dark:hover:bg-[#1A1E2D] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-[#FFD700]" /> : <Moon className="h-5 w-5 text-[#0846A6]" />}
          </button>
        </div>
      </div>
    </header>
  )
}
