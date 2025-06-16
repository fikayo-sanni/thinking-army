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
import { Users, TrendingUp } from "lucide-react"

// Mock data for network structure
const currentUser = {
  id: "current",
  name: "YOU",
  username: "currentuser",
  level: 0,
  joinDate: "2023-06-15",
  rank: "GOLD",
  isActive: true,
  totalReferrals: 12,
}

const uplineData = [
  {
    id: "upline1",
    name: "SARAH JOHNSON",
    username: "sarahj",
    level: 1,
    joinDate: "2023-05-10",
    rank: "PLATINUM",
    isActive: true,
    totalReferrals: 45,
    children: [
      {
        id: "upline2",
        name: "MICHAEL CHEN",
        username: "mchen",
        level: 2,
        joinDate: "2023-03-22",
        rank: "DIAMOND",
        isActive: true,
        totalReferrals: 128,
        children: [
          {
            id: "upline3",
            name: "ALEX RODRIGUEZ",
            username: "alexr",
            level: 3,
            joinDate: "2023-01-15",
            rank: "DIAMOND",
            isActive: true,
            totalReferrals: 256,
          },
        ],
      },
    ],
  },
]

const downlineData = [
  {
    id: "down1",
    name: "EMMA WILSON",
    username: "emmaw",
    level: 1,
    joinDate: "2023-07-20",
    rank: "SILVER",
    isActive: true,
    totalReferrals: 8,
    children: [
      {
        id: "down1-1",
        name: "JAMES BROWN",
        username: "jbrown",
        level: 2,
        joinDate: "2023-08-15",
        rank: "BRONZE",
        isActive: true,
        totalReferrals: 3,
      },
      {
        id: "down1-2",
        name: "LISA GARCIA",
        username: "lisag",
        level: 2,
        joinDate: "2023-09-01",
        rank: "SILVER",
        isActive: false,
        totalReferrals: 5,
      },
    ],
  },
  {
    id: "down2",
    name: "DAVID MILLER",
    username: "dmiller",
    level: 1,
    joinDate: "2023-08-05",
    rank: "GOLD",
    isActive: true,
    totalReferrals: 15,
    children: [
      {
        id: "down2-1",
        name: "SOPHIA DAVIS",
        username: "sophiad",
        level: 2,
        joinDate: "2023-09-10",
        rank: "BRONZE",
        isActive: true,
        totalReferrals: 2,
      },
    ],
  },
  {
    id: "down3",
    name: "RYAN TAYLOR",
    username: "rtaylor",
    level: 1,
    joinDate: "2023-09-15",
    rank: "BRONZE",
    isActive: true,
    totalReferrals: 1,
  },
]

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("downlines")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")

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

  const downlineStats = getNetworkStats(downlineData)
  const uplineStats = getNetworkStats(uplineData)

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
            <SummaryCard title="UPLINE LEVELS" value={uplineStats.total} color="text-[#6F00FF]" />
          </div>

          {/* Tab Navigation Block */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1A1E2D] border border-[#2C2F3C]">
              <TabsTrigger
                value="uplines"
                className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black text-[#A0AFC0] uppercase tracking-wide"
              >
                UPLINES
              </TabsTrigger>
              <TabsTrigger
                value="downlines"
                className="data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black text-[#A0AFC0] uppercase tracking-wide"
              >
                DOWNLINES
              </TabsTrigger>
            </TabsList>

            {/* Filter Controls Block */}
            <FilterControls
              levelFilter={levelFilter}
              setLevelFilter={setLevelFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
            />

            {/* Tree View Block */}
            <TabsContent value="uplines" className="mt-6">
              <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
                <CardHeader>
                  <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-[#00E5FF]" />
                    <span>UPLINE STRUCTURE</span>
                  </CardTitle>
                  <p className="text-[#A0AFC0] text-sm">Your referral chain going upward</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current User Node */}
                  <div className="flex justify-center">
                    <Card className="bg-[#00E5FF]/10 border-[#00E5FF]">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-[#00E5FF] flex items-center justify-center">
                            <span className="text-black font-bold text-sm">YOU</span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium uppercase text-sm">{currentUser.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-[#A0AFC0]">
                              <span>@{currentUser.username}</span>
                              <Badge className="bg-[#6F00FF]/20 text-[#6F00FF] border-[#6F00FF]/30">
                                {currentUser.rank}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Upline Tree */}
                  <div className="space-y-4">
                    {uplineData.map((upline) => (
                      <NetworkNode key={upline.id} user={upline} direction="up" isExpanded={true} />
                    ))}
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
                <CardContent className="space-y-4">
                  {/* Current User Node */}
                  <div className="flex justify-center">
                    <Card className="bg-[#00E5FF]/10 border-[#00E5FF]">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-[#00E5FF] flex items-center justify-center">
                            <span className="text-black font-bold text-sm">YOU</span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium uppercase text-sm">{currentUser.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-[#A0AFC0]">
                              <span>@{currentUser.username}</span>
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
                    {downlineData.map((downline) => (
                      <NetworkNode key={downline.id} user={downline} direction="down" isExpanded={true} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ModernSidebar>
  )
}
