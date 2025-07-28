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
import { useNetworkStructure, useNetworkStats, useDirectDownlines } from '@/hooks/use-network'
import { Skeleton } from '@/components/ui/skeleton'
import { NetworkStatsSkeleton, NetworkStructureSkeleton } from '@/components/network/network-skeletons'
import { formatThousands } from "@/lib/utils"
import { Button } from '@/components/ui/button'

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState("downlines")
  
  // 🚀 OPTIMIZED: Use individual hooks for parallel loading
  const { data: networkStructure, isLoading: isStructureLoading, isError: isStructureError, refetch: refetchStructure } = useNetworkStructure()
  const { data: statsData, isLoading: isStatsLoading, isError: isStatsError, refetch: refetchStats } = useNetworkStats('all-time')

  // Always call the hook at the top level, passing currentUser?.id (may be undefined)
  // We'll get currentUser from networkStructure after loading
  const currentUserId = networkStructure?.currentUser?.id
  const {
    data: rootDownlines = [],
    isLoading: isLoadingRootDownlines,
  } = useDirectDownlines(String(currentUserId), 0)

  // Check if any critical data failed to load
  const hasCriticalError = isStructureError || isStatsError;
  
  if (hasCriticalError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Network Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your network data right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => { refetchStructure(); refetchStats(); }} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Page Title Block */}
        <PageHeader title="MY NETWORK" description="Managing my network" />

        {/* Network Summary Stats - Load independently */}
        {isStatsLoading ? (
          <NetworkStatsSkeleton />
        ) : statsData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummaryCard 
              title="ACTIVE/TOTAL MEMBERS" 
              subtitle="DIRECT DOWNLINES" 
              value={formatThousands((statsData as any).activeMembers || 0) + '/' + formatThousands((statsData as any).totalDirectDownlines || 0)} 
              color="text-[#00B28C]" 
            />
            <SummaryCard 
              title="ACTIVE/TOTAL DOWNLINES" 
              subtitle="MY ENTIRE NETWORK" 
              value={formatThousands((statsData as any).totalActiveDownlines || 0) + '/' + formatThousands((statsData as any).totalDownlines || 0)} 
              color="text-[#0846A6]" 
            />
          </div>
        ) : (
          <div className="text-[#A0AFC0] text-center py-8">No network statistics available.</div>
        )}

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Filter Controls Block */}
          <FilterControls>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter controls can be added here in the future */}
            </div>
          </FilterControls>

          {/* Network Structure - Load independently */}
          <div className="mt-6">
            {isStructureLoading ? (
              <NetworkStructureSkeleton />
            ) : (
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
                     {networkStructure?.currentUser && (networkStructure?.downlines?.length > 0 || rootDownlines?.length > 0) ? (
                       <NetworkNode 
                         user={{
                           ...networkStructure.currentUser,
                           directReferrals: networkStructure.currentUser.totalReferrals || 0
                         } as any} 
                         sponsor={networkStructure.sponsor ? {
                           ...networkStructure.sponsor,
                           directReferrals: networkStructure.sponsor.totalReferrals || 0
                         } as any : undefined} 
                         totalReferrals={networkStructure.currentUser.totalReferrals || 0} 
                         direction="down" 
                         isExpanded={true} 
                       />
                     ) : (
                       <div className="text-[#A0AFC0] text-center py-8 w-full">
                         {isStructureError ? (
                           <div className="text-red-500">Failed to load network structure.</div>
                         ) : (
                           "No network data to display."
                         )}
                       </div>
                     )}
                   </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
