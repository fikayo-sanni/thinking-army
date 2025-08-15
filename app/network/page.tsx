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
import { useProfile } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { NetworkStatsSkeleton, NetworkStructureSkeleton } from '@/components/network/network-skeletons'
import { formatThousands } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { MobileFilterControls } from "@/components/layout/mobile-filter-controls"
import { useSetPageTitle } from "@/hooks/use-page-title"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

// Add card styles
const cardStyles = {
  base: "bg-white dark:bg-[#1E1E1E] border border-[#E4E6EB] dark:border-[#2A2A2A] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:border-[#DADCE0] dark:hover:border-[#3A3A3A] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
  header: "flex items-center justify-between p-4 border-b border-[#E4E6EB] dark:border-[#2A2A2A]",
  headerLeft: "flex items-center space-x-3",
  iconContainer: "flex items-center justify-center w-8 h-8 rounded-lg bg-[#297EFF]/10 dark:bg-[#4D8DFF]/10",
  icon: "w-5 h-5 text-[#297EFF] dark:text-[#4D8DFF]",
  title: "text-[15px] font-medium text-[#202124] dark:text-[#E6E6E6]",
  subtitle: "text-[12px] text-[#5F6368] dark:text-[#A0A0A0] mt-0.5",
  content: "p-4",
  metric: {
    container: "flex items-center justify-between p-3 rounded-md bg-[#F8F9FB] dark:bg-[#1A2B45] transition-colors duration-150",
    label: "text-[14px] text-[#5F6368] dark:text-[#A0A0A0]",
    value: "text-[20px] font-semibold text-[#202124] dark:text-[#E6E6E6]",
    change: {
      positive: "text-[12px] font-medium text-emerald-500 dark:text-emerald-400",
      negative: "text-[12px] font-medium text-red-500 dark:text-red-400",
      neutral: "text-[12px] font-medium text-[#5F6368] dark:text-[#A0A0A0]",
    },
  },
};

// Add type definitions
interface NetworkStats {
  activeMembers: number;
  totalDirectDownlines: number;
  totalActiveDownlines: number;
  totalDownlines: number;
}

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
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()

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
        /*const { referralService } = await import("@/lib/services/referral-service")
        const result = await referralService.generateReferralLink()
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        const fullLink = `${baseUrl}/invite?code=${result.code}`*/

        // Use the profile data from the backend

        const nickname = userProfile?.username
        if (!nickname) {
          throw new Error('Username not available')
        }
        
        const fullLink = `https://gcuniverse.io/start/${nickname}`
        
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
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-[22px] font-semibold text-[#202124] dark:text-[#E6E6E6]">
            My Network
          </h1>
          <div className="flex gap-2">
            <Button 
              onClick={copyInviteLink}
              variant="default"
              disabled={!canGenerateLink || loading || isProfileLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>{canGenerateLink ? 'Generate Invite Link' : 'Login Required'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Right Panel */}
      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Network Summary Stats */}
          {isStatsLoading ? (
            <NetworkStatsSkeleton />
          ) : statsData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <Users className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Direct Members</h3>
                      <p className={cardStyles.subtitle}>Active vs Total</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {formatThousands((statsData as NetworkStats).activeMembers)}/{formatThousands((statsData as NetworkStats).totalDirectDownlines)}
                      </div>
                      <div className={cardStyles.metric.label}>
                        Direct Downlines
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={cardStyles.base}>
                <div className={cardStyles.header}>
                  <div className={cardStyles.headerLeft}>
                    <div className={cardStyles.iconContainer}>
                      <TrendingUp className={cardStyles.icon} />
                    </div>
                    <div>
                      <h3 className={cardStyles.title}>Network Size</h3>
                      <p className={cardStyles.subtitle}>Active vs Total</p>
                    </div>
                  </div>
                </div>
                <div className={cardStyles.content}>
                  <div className={cardStyles.metric.container}>
                    <div>
                      <div className={cardStyles.metric.value}>
                        {formatThousands((statsData as NetworkStats).totalActiveDownlines)}/{formatThousands((statsData as NetworkStats).totalDownlines)}
                      </div>
                      <div className={cardStyles.metric.label}>
                        Total Network
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[#5F6368] dark:text-[#A0A0A0] text-center py-8">No network statistics available.</div>
          )}

          {/* Network Structure */}
          {isStructureLoading ? (
            <NetworkStructureSkeleton />
          ) : (
            <div className={cardStyles.base}>
              <div className={cardStyles.header}>
                <div className={cardStyles.headerLeft}>
                  <div className={cardStyles.iconContainer}>
                    <Users className={cardStyles.icon} />
                  </div>
                  <div>
                    <h3 className={cardStyles.title}>Downline Structure</h3>
                    <p className={cardStyles.subtitle}>Your referral network going downward</p>
                  </div>
                </div>
              </div>
              <div className={cardStyles.content}>
                <div className="flex justify-center">
                  {networkStructure?.currentUser ? (
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
                    <div className="text-[#5F6368] dark:text-[#A0A0A0] text-center py-8 w-full">
                      {isStructureError ? (
                        <div className="text-red-500">Failed to load network structure.</div>
                      ) : (
                        "No network data to display."
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Details Panel */}
        <div className="hidden xl:block w-[340px] bg-white dark:bg-[#1E1E1E] border-l border-[#E4E6EB] dark:border-[#2A2A2A]">
          <div className="sticky top-0 p-6 space-y-6">
            {/* Quick Stats Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Active Members</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-16 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      formatThousands((statsData as NetworkStats)?.activeMembers || 0)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Total Network</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      formatThousands((statsData as NetworkStats)?.totalDownlines || 0)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Direct Referrals</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {isStatsLoading ? (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    ) : (
                      formatThousands((statsData as NetworkStats)?.totalDirectDownlines || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {rootDownlines.slice(0, 5).map((downline: any) => (
                  <div key={downline.id} className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-[#297EFF]/10">
                      <User className="h-4 w-4 text-[#297EFF]" />
                    </div>
                    <div>
                      <p className="text-[14px] text-[#202124] dark:text-[#E6E6E6]">
                        {downline.nickname} joined your network
                      </p>
                      <span className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">
                        Level {downline.level || 1}
                      </span>
                    </div>
                  </div>
                ))}
                {rootDownlines.length === 0 && !isLoadingRootDownlines && (
                  <div className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0] text-center">
                    No recent activity
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
