"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { SummaryCard } from "@/components/ui/summary-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NetworkNode } from "@/components/network/network-node"
import { Users, TrendingUp, User } from "lucide-react"
import { useNetworkData, useNetworkStats } from '@/hooks/use-network'
import { Skeleton } from '@/components/ui/skeleton'

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("downlines")
  const { data: networkData, isLoading, isError } = useNetworkData()
  const { data: statsData, isLoading: isStatsLoading, isError: isStatsError } = useNetworkStats()

  if (isLoading || isStatsLoading) {
    return (
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6 space-y-6">
            <PageHeader title="MY NETWORK" description="Manage and track your referral network structure" />
            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-28 w-full bg-[#2C2F3C] rounded-lg" />
              ))}
            </div>
            {/* Main Content Area Skeleton */}
            <div className="space-y-6">
              {/* Tab Navigation Skeleton */}
              <div className="grid w-full grid-cols-2 gap-4 mb-4">
                <Skeleton className="h-10 w-full bg-[#2C2F3C] rounded-lg" />
                <Skeleton className="h-10 w-full bg-[#2C2F3C] rounded-lg" />
              </div>
              {/* Sponsor Card Skeleton */}
              <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-6 w-full mb-6">
                <div className="flex flex-col items-center space-y-6">
                  <Skeleton className="h-16 w-1/2 bg-[#2C2F3C] rounded-lg mb-2" />
                  <Skeleton className="h-10 w-1/3 bg-[#2C2F3C] rounded-lg" />
                </div>
              </div>
              {/* Downlines Card Skeleton */}
              <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-6 w-full">
                <div className="flex flex-col items-center space-y-6">
                  <Skeleton className="h-16 w-1/2 bg-[#2C2F3C] rounded-lg mb-2" />
                  <div className="space-y-4 w-full">
                    {[1,2,3].map(i => (
                      <Skeleton key={i} className="h-14 w-full bg-[#2C2F3C] rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModernSidebar>
    )
  }
  if (isError || isStatsError || !networkData || !statsData) {
    return (
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6 space-y-6">
            <PageHeader title="MY NETWORK" description="Manage and track your referral network structure" />
            <div className="text-red-500">Failed to load network data.</div>
          </div>
        </div>
      </ModernSidebar>
    )
  }
  const { structure } = networkData
  const { currentUser, sponsor, downlines } = structure
  const { totalDownlines, activeMembers } = statsData

  const getNetworkStats = (data: any[]) => {
    const flattenNetwork = (nodes: any[]): any[] => {
      return nodes.reduce((acc, node) => {
        acc.push(node)
        if (node.children) {
          acc.push(...flattenNetwork(node.children))
        }
        return acc
      }, [])
    }

    const allMembers = flattenNetwork(data)
    const activeMembers = allMembers.filter((member) => member.isActive)
    const totalReferrals = allMembers.reduce((sum, member) => sum + member.totalReferrals, 0)

    return {
      total: allMembers.length,
      active: activeMembers.length,
      totalReferrals,
    }
  }

  const downlineStats = getNetworkStats(downlines)

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="MY NETWORK" description="Manage and track your referral network structure" />

          {/* Network Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard title="TOTAL DOWNLINES" value={downlineStats.total} color="text-[#00E5FF]" />
            <SummaryCard title="ACTIVE MEMBERS" value={downlineStats.active} color="text-[#00FFC8]" />
            <SummaryCard title="SPONSOR" value="1" color="text-[#6F00FF]" />
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Tab Navigation Block */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#1A1E2D] border border-[#2C2F3C]">
                <TabsTrigger
                  value="sponsor"
                  className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black text-[#A0AFC0] uppercase tracking-wide"
                >
                  SPONSOR
                </TabsTrigger>
                <TabsTrigger
                  value="downlines"
                  className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black text-[#A0AFC0] uppercase tracking-wide"
                >
                  DOWNLINES
                </TabsTrigger>
              </TabsList>

              {/* Filter Controls Block */}
              <FilterControls>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Filter controls can be added here in the future */}
                </div>
              </FilterControls>

              {/* Sponsor View Block */}
              <TabsContent value="sponsor" className="mt-6">
                <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
                  <CardHeader>
                    <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                      <User className="h-5 w-5 text-[#00E5FF]" />
                      <span>YOUR SPONSOR</span>
                    </CardTitle>
                    <p className="text-[#A0AFC0] text-sm">Your direct sponsor information</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current User Node */}
                    <div className="flex justify-center">
                      <Card className="bg-[#00E5FF]/10 border-[#00E5FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-[#00E5FF] flex items-center justify-center">
                              <span className="text-black font-bold text-sm">YOU</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium uppercase text-sm">{currentUser.nickname || "YOU"}</h3>
                              <div className="flex items-center space-x-2 text-xs text-[#A0AFC0]">
                                <Badge className="bg-[#6F00FF]/20 text-[#6F00FF] border-[#6F00FF]/30">
                                  {currentUser.rank}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Connection Line */}
                    <div className="flex justify-center">
                      <div className="w-px h-8 bg-[#2C2F3C]" />
                    </div>

                    {/* Sponsor Node */}
                    <div className="flex justify-center">
                      <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-[#6F00FF] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {sponsor.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium uppercase text-sm">{sponsor.name}</h3>
                              <div className="flex items-center space-x-2 text-xs text-[#A0AFC0]">
                                <span>@{sponsor.username}</span>
                                <Badge className="bg-[#6F00FF]/20 text-[#6F00FF] border-[#6F00FF]/30">
                                  {sponsor.rank}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="downlines" className="mt-6">
                <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
                  <CardHeader>
                    <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                      <Users className="h-5 w-5 text-[#00E5FF]" />
                      <span>DOWNLINE STRUCTURE</span>
                    </CardTitle>
                    <p className="text-[#A0AFC0] text-sm">Your referral network going downward</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current User Node */}
                    <div className="flex justify-center">
                      <Card className="bg-[#00E5FF]/10 border-[#00E5FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-[#00E5FF] flex items-center justify-center">
                              <span className="text-black font-bold text-sm">YOU</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium uppercase text-sm">{currentUser.nickname || "YOU"}</h3>
                              <div className="flex items-center space-x-2 text-xs text-[#A0AFC0]">
                                <Badge className="bg-[#6F00FF]/20 text-[#6F00FF] border-[#6F00FF]/30">
                                  {currentUser.rank}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Downline Tree */}
                    <div className="space-y-4">
                      {downlines.map((downline) => (
                        <NetworkNode key={downline.id} user={downline} direction="down" isExpanded={true} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ModernSidebar>
  )
}
