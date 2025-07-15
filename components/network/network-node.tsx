"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Users, Calendar, Award } from "lucide-react"
import { useState, useEffect } from "react"
import { useDirectDownlines } from '@/hooks/use-network'

interface NetworkUser {
  id: string
  name?: string
  username?: string
  nickname?: string
  anonymizedEmail?: string
  level: number
  joinDate: string
  rank: string
  isActive: boolean
  totalReferrals: number
  children?: NetworkUser[]
  avatar?: string
}

interface NetworkNodeProps {
  user: NetworkUser
  isExpanded?: boolean
  onToggle?: () => void
  direction: "up" | "down"
}

export function NetworkNode({ user, isExpanded = false, onToggle, direction }: NetworkNodeProps) {
  const PAGE_SIZE = 20;
  const [expanded, setExpanded] = useState(isExpanded)
  const [page, setPage] = useState(1)
  const [children, setChildren] = useState<NetworkUser[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch children for the current page
  const { data: directDownlines = [], isLoading: isLoadingChildren } = useDirectDownlines(user.id, page, PAGE_SIZE)

  // When expanded or page changes, update children
  useEffect(() => {
    if (!expanded) return;
    if (page === 1) {
      setChildren([]); // Reset children if first page
    }
    setLoadingMore(true);
  }, [expanded, page])

  // When data loads, append to children
  useEffect(() => {
    if (!expanded) return;
    if (directDownlines && directDownlines.length > 0) {
      setChildren((prev) => {
        // If page is 1, replace; else, append
        if (page === 1) return directDownlines;
        // Avoid duplicates
        const ids = new Set(prev.map((c) => c.id));
        return [...prev, ...directDownlines.filter((c) => !ids.has(c.id))];
      });
      setHasMore(directDownlines.length === PAGE_SIZE);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  }, [directDownlines, expanded, page])

  const handleToggle = () => {
    setExpanded((prev) => !prev)
    if (!expanded) {
      setPage(1);
    }
    onToggle?.()
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  // Only fetch and show children if expanded
  const showChildren = expanded

  // Only show expand button if we want to always allow expansion
  const showExpand = true

  // Handle both old and new data structures
  const displayName = user.nickname || user.name || "Unknown"
  const displayIdentifier = user.anonymizedEmail || `@${user.username}` || "Unknown"

  // Generate avatar fallback from nickname or name
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="relative">
      {/* Connection Line */}
      {direction === "down" && <div className="absolute left-6 -top-4 w-px h-4 dark:bg-[#2C2F3C]" />}
      {direction === "up" && <div className="absolute left-6 -bottom-4 w-px h-4 dark:bg-[#2C2F3C]" />}

      <Card className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-[#E5E7EB] mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Expand/Collapse Button */}
            {showExpand && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="p-1 h-6 w-6 text-[#A0AFC0] dark:hover:text-white dark:hover:bg-[#2C2F3C]"
              >
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}

            {/* Avatar */}
            <Avatar className="h-10 w-10 ring-2 dark:ring-[#2C2F3C]">
              <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} />
              <AvatarFallback className="bg-[#0D0F1A] text-[#0846A6]">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-white font-medium uppercase text-sm">{displayName}</h3>
                <Badge
                  className={`text-xs ${user.isActive
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }`}
                >
                  {user.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-xs text-[#A0AFC0]">
                <span className="font-mono">{displayIdentifier}</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{user.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Level and Stats */}
            <div className="text-right">
              <Badge className="bg-[#0846A6]/20 text-[#0846A6] border-[#0846A6]/30 mb-2">L{user.level}</Badge>
              <div className="flex items-center space-x-3 text-xs text-[#A0AFC0]">
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3" />
                  <span>{user.rank}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{user.totalReferrals}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children (on-demand fetch) */}
      {showChildren && (
        <div className="ml-8 relative">
          {/* Vertical line for children */}
          <div className="absolute left-2 top-0 bottom-0 w-px dark:bg-[#2C2F3C]" />
          {isLoadingChildren && page === 1 ? (
            <div className="text-[#A0AFC0] text-xs ml-4">Loading...</div>
          ) : (
            <>
              {children.map((child) => (
                <div key={child.id} className="relative">
                  {/* Horizontal line to child */}
                  <div className="absolute left-2 top-6 w-4 h-px dark:bg-[#2C2F3C]" />
                  <NetworkNode user={{ ...child, level: (user.level ?? 0) + 1 }} direction={direction} />
                </div>
              ))}
              {hasMore && (
                <center><div className="ml-8 my-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="text-[#0846A6] border-[#0846A6] hover:bg-[#0846A6]/10"
                  >
                    {loadingMore ? "Loading..." : "LOAD MORE"}
                  </Button>
                </div></center>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
