"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Users, Calendar, Award } from "lucide-react"
import { useState, useEffect } from "react"
import { useDirectDownlines } from '@/hooks/use-network'

interface NetworkUser {
  directReferrals: number;
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
  sponsor?: NetworkUser
  totalReferrals?: number
  isExpanded?: boolean
  onToggle?: () => void
  direction: "up" | "down"
  isSponsorNode?: boolean
}

// Add card styles
const nodeStyles = {
  base: "bg-white dark:bg-[#1E1E1E] border border-[#E4E6EB] dark:border-[#2A2A2A] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:border-[#DADCE0] dark:hover:border-[#3A3A3A] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
  content: "p-4",
  header: "flex items-center space-x-4",
  info: {
    container: "flex-1 min-w-0",
    name: "text-[#202124] dark:text-[#E6E6E6] font-medium text-sm mb-1 truncate",
    meta: "flex items-center space-x-2 text-[#5F6368] dark:text-[#A0A0A0] text-xs",
  },
  stats: {
    container: "text-right shrink-0",
    badge: {
      level: "bg-[#297EFF]/10 text-[#297EFF] border-[#297EFF]/30 mb-2 text-xs",
      sponsor: "bg-[#6F00FF]/10 text-[#6F00FF] border-[#6F00FF]/30 text-xs",
      active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs",
      inactive: "bg-gray-500/10 text-gray-400 border-gray-500/30 text-xs",
    },
    meta: "flex items-center space-x-2 text-[#5F6368] dark:text-[#A0A0A0] text-xs",
  },
  expandButton: "p-1 h-8 w-8 text-[#5F6368] dark:text-[#A0A0A0] hover:bg-[#F8F9FB] dark:hover:bg-[#1A2B45] hover:text-[#202124] dark:hover:text-[#E6E6E6] rounded-md transition-colors",
  avatar: {
    container: "h-10 w-10 ring-2 ring-[#E4E6EB] dark:ring-[#2A2A2A]",
    fallback: "bg-[#F8F9FB] dark:bg-[#1A2B45] text-[#297EFF] text-sm font-medium",
  },
  connection: {
    line: "bg-[#E4E6EB] dark:bg-[#2A2A2A]",
    vertical: "w-px",
    horizontal: "h-px",
  },
};

export function NetworkNode({ user, sponsor, isExpanded = false, onToggle, direction, totalReferrals = 0, isSponsorNode = false }: NetworkNodeProps) {
  const PAGE_SIZE = 20;
  const [expanded, setExpanded] = useState(isExpanded)
  const [page, setPage] = useState(1)
  const [children, setChildren] = useState<NetworkUser[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch children for the current page
  const { data: directDownlines = [], isLoading: isLoadingChildren } = useDirectDownlines(user.id, user.level, page, PAGE_SIZE)

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
      setChildren((prev: any) => {
        // Compute the next level for children
        const nextLevel = (user.level ?? 0) + 1;
        const downlinesWithLevel = directDownlines.map((c) => ({ ...c, level: nextLevel }));
        // If page is 1, replace; else, append
        if (page === 1) return downlinesWithLevel;
        // Avoid duplicates
        const ids = new Set(prev.map((c: any) => c.id));
        return [...prev, ...downlinesWithLevel.filter((c) => !ids.has(c.id))];
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
  const showExpand = user.totalReferrals > 0 || totalReferrals > 0

  // Handle both old and new data structures
  const displayName = user.nickname || user.name || "Unknown"
  const displayIdentifier = user.anonymizedEmail || `@${user.username}` || "Unknown"

  // Generate avatar fallback from nickname or name
  const avatarFallback = 
    displayName?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"

  return (
    <div className="relative">
      {/* Show sponsor above current user when sponsor exists */}
      {sponsor && (
        <div className="relative mb-6">
          <NetworkNode user={sponsor} direction="up" isSponsorNode={true} />
          {/* Connection line from sponsor to current user */}
          <div className={`absolute left-6 -bottom-6 h-8 ${nodeStyles.connection.line} ${nodeStyles.connection.vertical}`} />
        </div>
      )}

      {/* Connection Line */}
      {direction === "down" && <div className={`absolute left-6 -top-4 h-4 ${nodeStyles.connection.line} ${nodeStyles.connection.vertical}`} />}
      {direction === "up" && <div className={`absolute left-6 -bottom-4 h-4 ${nodeStyles.connection.line} ${nodeStyles.connection.vertical}`} />}

      <div className={`${nodeStyles.base} mb-4`}>
        <div className={nodeStyles.content}>
          <div className={nodeStyles.header}>
            {/* Expand/Collapse Button */}
            {showExpand && (
              <button
                onClick={handleToggle}
                className={nodeStyles.expandButton}
              >
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}

            {/* Avatar */}
            <Avatar className={nodeStyles.avatar.container}>
              <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} />
              <AvatarFallback className={nodeStyles.avatar.fallback}>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className={nodeStyles.info.container}>
              <div className="flex items-center space-x-2">
                <h3 className={nodeStyles.info.name}>{displayName}</h3>
                <Badge
                  className={user.isActive ? nodeStyles.stats.badge.active : nodeStyles.stats.badge.inactive}
                >
                  {user.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              <div className={nodeStyles.info.meta}>
                <span className="font-mono truncate">{displayIdentifier}</span>
                {user.joinDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{user.joinDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Level and Stats */}
            <div className={nodeStyles.stats.container}>
              {/* Only show level badge if not sponsor node */}
              {!isSponsorNode ? (
                <Badge className={nodeStyles.stats.badge.level}>
                  {user.level > 0 ? `L${user.level}` : "ME"}
                </Badge>
              ) : (
                <Badge className={nodeStyles.stats.badge.sponsor}>SPONSOR</Badge>
              )}
              {!isSponsorNode && (
                <div className={nodeStyles.stats.meta}>
                  <div className="flex items-center space-x-1">
                    <Award className="h-3 w-3" />
                    <span className="truncate">{user.rank}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{user.totalReferrals || totalReferrals}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children (on-demand fetch) */}
      {showChildren && (
        <div className="ml-8 relative">
          {/* Vertical line for children */}
          <div className={`absolute left-2 top-0 bottom-0 ${nodeStyles.connection.line} ${nodeStyles.connection.vertical}`} />
          {isLoadingChildren && page === 1 ? (
            <div className="text-[#5F6368] dark:text-[#A0A0A0] text-xs ml-4">Loading...</div>
          ) : (
            <>
              {children.map((child) => (
                <div key={child.id} className="relative">
                  {/* Horizontal line to child */}
                  <div className={`absolute left-2 top-6 w-4 ${nodeStyles.connection.line} ${nodeStyles.connection.horizontal}`} />
                  <NetworkNode user={{ ...child, level: (user.level ?? 0) + 1 }} direction={direction} />
                </div>
              ))}
              {hasMore && (
                <div className="text-center">
                  <div className="ml-8 my-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="h-9 text-[#297EFF] border-[#297EFF] hover:bg-[#297EFF]/10"
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
