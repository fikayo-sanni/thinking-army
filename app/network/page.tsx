"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { SummaryCard } from "@/components/ui/summary-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NetworkNode } from "@/components/network/network-node"
import { Users, TrendingUp, User, AlertTriangle } from "lucide-react"
import { useNetworkData, useNetworkStats, useDirectDownlines } from '@/hooks/use-network'
import { Skeleton } from '@/components/ui/skeleton'
import { formatThousands } from "@/lib/utils"
import { Button } from '@/components/ui/button'

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("downlines")
  const { data: networkData, isLoading, isError, refetch: refetchNetwork } = useNetworkData()
  const { data: statsData, isLoading: isStatsLoading, isError: isStatsError, refetch: refetchStats } = useNetworkStats('all-time')

  // Always call the hook at the top level, passing currentUser?.id (may be undefined)
  // We'll get currentUser from networkData after loading
  const currentUserId = networkData?.structure?.currentUser?.id
  const {
    data: rootDownlines = [],
    isLoading: isLoadingRootDownlines,
  } = useDirectDownlines(String(currentUserId), 0)

  if (isLoading || isStatsLoading) {
    return (
      <div className="min-h-screen">
        <div className="p-6 space-y-6">
          <PageHeader title="MY NETWORK" description="Managing my network" />
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-28 w-full dark:bg-[#2C2F3C] rounded-lg" />
            ))}
          </div>
          {/* Main Content Area Skeleton */}
          <div className="space-y-6">
            {/* Tab Navigation Skeleton */}
            <div className="grid w-full grid-cols-2 gap-4 mb-4">
              <Skeleton className="h-10 w-full dark:bg-[#2C2F3C] rounded-lg" />
              <Skeleton className="h-10 w-full dark:bg-[#2C2F3C] rounded-lg" />
            </div>
            {/* Sponsor Card Skeleton */}
            <div className="dark:bg-[#1A1E2D] border-[#E5E7EB] border dark:border-[#2C2F3C] rounded-lg p-6 w-full mb-6">
              <div className="flex flex-col items-center space-y-6">
                <Skeleton className="h-16 w-1/2 dark:bg-[#2C2F3C] rounded-lg mb-2" />
                <Skeleton className="h-10 w-1/3 dark:bg-[#2C2F3C] rounded-lg" />
              </div>
            </div>
            {/* Downlines Card Skeleton */}
            <div className="border-[#E5E7EB] dark:bg-[#1A1E2D] border dark:border-[#2C2F3C] rounded-lg p-6 w-full">
              <div className="flex flex-col items-center space-y-6">
                <Skeleton className="h-16 w-1/2 dark:bg-[#2C2F3C] rounded-lg mb-2" />
                <div className="space-y-4 w-full">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-14 w-full dark:bg-[#2C2F3C] rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (isError || isStatsError || !networkData || !statsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Network Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your network data right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchNetwork(); refetchStats(); }} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  const { structure } = networkData
  const { currentUser, sponsor, downlines, totalReferrals } = structure
  const { totalDownlines, activeMembers } = statsData

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Page Title Block */}
        <PageHeader title="MY NETWORK" description="Managing my network" />

        {/* Network Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <SummaryCard title="ACTIVE/TOTAL MEMBERS" subtitle="DIRECT DOWNLINES" value={formatThousands(statsData.activeMembers) + '/' + formatThousands(statsData.totalDirectDownlines)} color="text-[#00B28C]" />

          <SummaryCard title="ACTIVE/TOTAL DOWNLINES" subtitle="MY ENTIRE NETWORK" value={formatThousands(statsData.totalActiveDownlines) + '/' + formatThousands(statsData.totalDownlines)} color="text-[#0846A6]" />

        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Tab Navigation Block */}


          {/* Filter Controls Block */}
          <FilterControls>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter controls can be added here in the future */}
            </div>
          </FilterControls>

          {/* Sponsor View Block */}
          <div className="mt-6">

            <Card className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                  <Users className="h-5 w-5 text-[#0846A6]" />
                  <span>DOWNLINE STRUCTURE</span>
                </CardTitle>
                <p className="text-[#A0AFC0] text-sm">Your referral network going downward</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current User Node (map) - only show if data exists */}
                <div className="flex justify-center">
                  {currentUser && (downlines?.length > 0 || rootDownlines?.length > 0) ? (
                    <NetworkNode user={currentUser} sponsor={sponsor} totalReferrals={totalReferrals} direction="down" isExpanded={true} />
                  ) : (
                    <div className="text-[#A0AFC0] text-center py-8 w-full">No network data to display.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
