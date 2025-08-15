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

// First, let's update the header background and border styles
const headerStyles = "flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 bg-white dark:bg-[#1E1E1E] border-b border-[#E4E6EB] dark:border-[#2A2A2A]";

// Update the button styles for consistent look
const iconButtonStyles = "h-9 w-9 rounded-md bg-white hover:bg-[#F8F9FB] dark:bg-[#1E1E1E] dark:hover:bg-[#1E1E1E] border border-[#E4E6EB] hover:border-[#297EFF] dark:border-[#2A2A2A] dark:hover:border-[#4D8DFF]";

// Update the icon colors
const iconStyles = "h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]";

// Update the search input styles
const searchInputStyles = "pl-10 bg-[#F8F9FB] dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] placeholder:text-[#9AA0A6] dark:placeholder:text-[#A0A0A0] focus:border-[#297EFF] focus:ring-2 focus:ring-[#297EFF]/10 dark:focus:border-[#4D8DFF] dark:focus:ring-[#4D8DFF]/10 h-9";

// Update the dropdown styles
const dropdownStyles = "w-56 bg-white dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A]";
const dropdownItemStyles = "text-[#202124] dark:text-[#E6E6E6] hover:bg-[#F8F9FB] hover:text-[#297EFF] dark:hover:bg-[#1E1E1E] dark:hover:text-[#4D8DFF]";
const dropdownSeparatorStyles = "bg-[#E4E6EB] dark:bg-[#2A2A2A]";

// Update the notification badge styles
const badgeStyles = "absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#297EFF] dark:bg-[#4D8DFF] text-white dark:text-white text-xs p-0 flex items-center justify-center";

// Update the notification icon colors
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "commission":
      return <TrendingUp className="h-4 w-4 text-[#297EFF] dark:text-[#4D8DFF]" />
    case "rank":
      return <Gift className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
    case "payout":
      return <Wallet className="h-4 w-4 text-amber-500 dark:text-amber-400" />
    default:
      return <MessageSquare className="h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]" />
  }
}

export function ModernHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const unreadCount = notifications.filter((n) => n.unread).length
  const { logout, user } = useAuth()
  // console.log(user) // Removed for performance
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()

  const handleLogout = () => {
    logout()
    router.replace('/')
  }

  return (
    <header className={headerStyles}>
      {/* Mobile Layout */}
      <div className="flex items-center justify-between w-full lg:hidden">
        {/* Left side - Menu button */}
        <SidebarTrigger className={iconButtonStyles} />

        {/* Center - Logo/Title could go here if needed */}
        <div className="flex-1" />

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={iconButtonStyles}
          >
            {theme === "dark" ? (
              <Sun className={iconStyles} />
            ) : (
              <Moon className={iconStyles} />
            )}
          </Button>

          {/* Mobile Search Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className={iconButtonStyles}
          >
            <Search className={iconStyles} />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 w-9 rounded-md p-0">
                <Avatar className="h-8 w-8 ring-2 ring-[#297EFF]/10 dark:ring-[#4D8DFF]/10">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                  <AvatarFallback className="bg-[#297EFF]/5 text-[#297EFF] dark:bg-[#4D8DFF]/5 dark:text-[#4D8DFF] font-medium text-sm">
                    GC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={dropdownStyles} align="end">
              <DropdownMenuItem className={dropdownItemStyles} asChild>
                <Link href="/profile-settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className={dropdownSeparatorStyles} />
              <DropdownMenuItem 
                className="text-red-500 hover:text-red-500 hover:bg-red-500/5 dark:text-red-400 dark:hover:text-red-400 dark:hover:bg-red-400/5 cursor-pointer" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Search Section */}
        <div className="flex-1 max-w-md">
          {/*<div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]" />
            <Input
              placeholder="Search transactions, users, or NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchInputStyles}
            />
          </div>*/}
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={iconButtonStyles}
          >
            {theme === "dark" ? (
              <Sun className={iconStyles} />
            ) : (
              <Moon className={iconStyles} />
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 w-9 rounded-md p-0">
                <Avatar className="h-8 w-8 ring-2 ring-[#297EFF]/10 dark:ring-[#4D8DFF]/10">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                  <AvatarFallback className="bg-[#297EFF]/5 text-[#297EFF] dark:bg-[#4D8DFF]/5 dark:text-[#4D8DFF] font-medium text-sm">
                    GC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={dropdownStyles} align="end">
              <DropdownMenuItem className={dropdownItemStyles} asChild>
                <Link href="/profile-settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className={dropdownSeparatorStyles} />
              <DropdownMenuItem 
                className="text-red-500 hover:text-red-500 hover:bg-red-500/5 dark:text-red-400 dark:hover:text-red-400 dark:hover:bg-red-400/5 cursor-pointer" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 right-0 z-50 lg:hidden bg-white dark:bg-[#1E1E1E] border-b border-[#E4E6EB] dark:border-[#2A2A2A] p-4">
          {/*<div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]" />
            <Input
              placeholder="Search transactions, users, or NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchInputStyles}
              autoFocus
            />
          </div>*/}
        </div>
      )}
    </header>
  )
}
