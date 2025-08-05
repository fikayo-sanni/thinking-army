"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { FilterControls } from "@/components/layout/filter-controls"
import { SummaryCard } from "@/components/ui/summary-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NetworkNode } from "@/components/network/network-node"
import { Users, TrendingUp, User, AlertTriangle, Share2, Copy, Check, Loader2 } from "lucide-react"
import { useNetworkStructure, useNetworkStats, useDirectDownlines } from '@/hooks/use-network'
import { Skeleton } from '@/components/ui/skeleton'
import { NetworkStatsSkeleton, NetworkStructureSkeleton } from '@/components/network/network-skeletons'
import { formatThousands } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { MobileFilterControls } from "@/components/layout/mobile-filter-controls"
import { useSetPageTitle } from "@/hooks/use-page-title"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

export default function NetworkPage() {
  // Set page title
  useSetPageTitle("My Network");

  const [activeTab, setActiveTab] = useState("downlines")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, youreId } = useAuth()
  
  // Check if user is authenticated and has required data
  // Just need authToken since backend can determine user ID from the token
  const canGenerateLink = typeof window !== 'undefined' && localStorage.getItem('authToken')
  
  // Debug auth state
  console.log('Auth Debug:', { 
    user: user ? { 
      id_token: user.id_token ? 'present' : 'missing',
      profile: user.profile 
    } : null, 
    youreId, 
    userSub: user?.profile?.sub,
    hasAuthToken: typeof window !== 'undefined' ? !!localStorage.getItem('authToken') : false,
    authToken: typeof window !== 'undefined' ? localStorage.getItem('authToken')?.substring(0, 20) + '...' : null,
    canGenerateLink
  })
  
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

  // Copy invite link to clipboard
  const copyInviteLink = async () => {
    if (loading) return // Prevent multiple clicks while loading
    
    setLoading(true)
    try {
      const { referralService } = await import("@/lib/services/referral-service")
      const result = await referralService.generateReferralLink()
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const fullLink = `${baseUrl}/invite?code=${result.code}`
      
      await navigator.clipboard.writeText(fullLink)
      setCopied(true)
      toast({
        title: "Invite link copied!",
        description: "Share this link to invite people to your network.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err: any) {
      console.error('Referral link generation error:', err)
      toast({
        title: "Failed to generate invite link",
        description: err.message || "Please try again or check your connection.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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
      <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Page Title Block with Invite Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PageHeader title="MY NETWORK" description="Managing my network" />
          <div className="flex gap-2">
            <Button 
              onClick={copyInviteLink}
              className="bg-[#0846A6] hover:bg-[#06377a] text-white flex items-center gap-2"
              disabled={!canGenerateLink || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  {canGenerateLink ? 'Generate Invite Link' : 'Login Required'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Network Summary Stats - Load independently */}
        {isStatsLoading ? (
          <NetworkStatsSkeleton />
        ) : statsData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#00B28C]/10">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#00B28C]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white mobile-text-lg">
                  {formatThousands((statsData as any).activeMembers || 0)}/{formatThousands((statsData as any).totalDirectDownlines || 0)}
                </div>
                <div className="text-[#A0AFC0] text-xs sm:text-sm uppercase tracking-wider mobile-text-sm">
                  ACTIVE/TOTAL MEMBERS
                </div>
                <div className="text-[#A0AFC0] text-xs">DIRECT DOWNLINES</div>
              </CardContent>
            </Card>

            <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
              <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#0846A6]/10">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#0846A6]" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white mobile-text-lg">
                  {formatThousands((statsData as any).totalActiveDownlines || 0)}/{formatThousands((statsData as any).totalDownlines || 0)}
                </div>
                <div className="text-[#A0AFC0] text-xs sm:text-sm uppercase tracking-wider mobile-text-sm">
                  ACTIVE/TOTAL DOWNLINES
                </div>
                <div className="text-[#A0AFC0] text-xs">MY ENTIRE NETWORK</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-[#A0AFC0] text-center py-8">No network statistics available.</div>
        )}

        {/* Main Content Area */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Filter Controls Block */}
          <MobileFilterControls title="Network Filters">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Filter controls can be added here in the future */}
              <div className="text-[#A0AFC0] text-sm">No filters available yet</div>
            </div>
          </MobileFilterControls>

          {/* Network Structure - Load independently */}
          <div>
            {isStructureLoading ? (
              <NetworkStructureSkeleton />
            ) : (
              <Card className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB] mobile-card">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                    <Users className="h-5 w-5 text-[#0846A6]" />
                    <span>DOWNLINE STRUCTURE</span>
                  </CardTitle>
                  <p className="text-[#A0AFC0] text-sm">Your referral network going downward</p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Current User Node (map) - only show if data exists */}
                  <div className="flex justify-center">
                    {networkStructure?.currentUser && (networkStructure?.downlines?.length > 0 || rootDownlines?.length > 0) ? (
                      <div className="w-full max-w-4xl">
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
                      </div>
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
