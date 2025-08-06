"use client"

import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RankBadge } from "@/components/ranks/rank-badge"
import { ProgressBar } from "@/components/ranks/progress-bar"
import { Trophy, TrendingUp, Calendar, CheckCircle, Target, Gift, AlertTriangle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useRanksData } from '@/hooks/use-ranks'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export default function RanksPage() {
  const { data, isLoading, isError, refetch } = useRanksData()
  
  // Helper function to find current rank requirements from allRanks array
  const getCurrentRankRequirements = (currentRankName: string, allRanks: any[]) => {
    return allRanks.find(rank => rank.name === currentRankName)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="p-6 space-y-6">
          <PageHeader title="RANKS" description="Track your rank progression and unlock new benefits" />
          {/* Summary/Metric Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-28 w-full dark:bg-[#2C2F3C] rounded-lg" />
            ))}
          </div>
          {/* Progress Tracker Skeleton */}
          <div className="dark:bg-[#1A1E2D] border-[#E5E7EB] border dark:border-[#E5E7EB] rounded-lg p-6 w-full">
            <Skeleton className="h-6 w-48 mb-4 dark:bg-[#2C2F3C]" />
            <Skeleton className="h-8 w-1/2 mb-4 dark:bg-[#2C2F3C]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-6 w-full dark:bg-[#2C2F3C]" />
                ))}
              </div>
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-6 w-full dark:bg-[#2C2F3C]" />
                ))}
              </div>
            </div>
          </div>
          {/* Rank History Skeleton */}
          <div className="dark:bg-[#1A1E2D] border dark:border-[#E5E7EB] border-[#E5E7EB] rounded-lg p-6 w-full space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-14 w-full dark:bg-[#2C2F3C]" />
            ))}
          </div>
          {/* All Ranks & Benefits Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-48 w-full dark:bg-[#2C2F3C] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Ranks Load Failed</h2>
            <p className="text-center text-[#A0AFC0] mb-6">We couldn't load your ranks data right now. Please check your connection or try again in a moment.</p>
            <Button onClick={() => refetch()} className="bg-[#0846A6] text-white hover:bg-[#06377a]">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  const { currentRank, nextRankRequirements, rankHistory, allRanks } = data

  // Get current rank requirements
  const currentRankRequirements = getCurrentRankRequirements(currentRank?.name, allRanks)

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Page Title Block */}
        <PageHeader title="RANKS" description="Track your rank progression and unlock new benefits" />

        <div className="p-6 space-y-6">
          {/* Current Rank Summary Block */}
          <Card className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-[#0846A6]" />
                <span>CURRENT RANK</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <RankBadge rank={currentRank?.name} size="lg" />
                    <div>
                      <div className="text-white text-lg font-bold">RANK ACHIEVED</div>
                      {currentRank ? <div className="flex items-center space-x-2 text-[#A0AFC0] text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(currentRank?.achievedDate)}</span>
                        <span>({currentRank?.monthsAtRank} months ago)</span>
                      </div> : <></>}
                    </div>
                  </div>
                </div>

                {currentRank ? <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0846A6] mb-1">{currentRank.totalVolume} VP</div>
                    <div className="dark:text-[#A0AFC0] text-xs uppercase tracking-wider">TOTAL VOLUME</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00B28C] mb-1">{currentRank.teamSize}</div>
                    <div className="dark:text-[#A0AFC0] text-xs uppercase tracking-wider">TEAM SIZE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#6F00FF] mb-1">{currentRank.directReferrals}</div>
                    <div className="dark:text-[#A0AFC0] text-xs uppercase tracking-wider">DIRECT REFS</div>
                  </div>
                </div> : <></>}
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracker Block - Now shows progress to maintain current rank */}
          {currentRank && currentRankRequirements ? <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <Target className="h-6 w-6 text-[#0846A6]" />
                <span>MAINTAINING</span>
                <RankBadge rank={currentRank.name} size="sm" showIcon={false} />
              </CardTitle>
              <p className="text-[#A0AFC0] text-sm">Track your progress to maintain your current rank requirements</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ProgressBar
                    label="TOTAL VOLUME"
                    current={currentRank.totalVolume}
                    target={parseInt(currentRankRequirements.requirements.volume.replace(/[^0-9]/g, ''))}
                    unit="VP"
                    color="bg-[#0846A6]"
                  />
                  <ProgressBar
                    label="DIRECT REFERRALS"
                    current={currentRank.directReferrals}
                    target={parseInt(currentRankRequirements.requirements.directReferrals.replace(/[^0-9]/g, ''))}
                    unit="users"
                    color="bg-[#00B28C]"
                  />
                </div>
                <div className="space-y-4">
                  <ProgressBar
                    label="TEAM SIZE"
                    current={currentRank.teamSize}
                    target={parseInt(currentRankRequirements.requirements.teamSize.replace(/[^0-9]/g, ''))}
                    unit="members"
                    color="bg-[#6F00FF]"
                  />
                  <ProgressBar
                    label="MONTHLY VOLUME"
                    current={nextRankRequirements?.currentMonthlyVolume || 0}
                    target={nextRankRequirements?.monthlyVolumeRequired || 1}
                    unit="VP"
                    color="bg-yellow-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card> : null}

          {/* Rank History Block */}
          {/*<Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-[#0846A6]" />
                <span>RANK HISTORY</span>
              </CardTitle>
              <p className="text-[#A0AFC0] text-sm">Your rank progression timeline</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rankHistory.map((entry, index) => (
                  <div
                    key={entry.rank}
                    className="flex items-center space-x-4 p-4 rounded-lg dark:bg-[#0D0F1A] border border-[#E5E7EB] dark:border-[#E5E7EB]"
                  >
                    <div className="flex-shrink-0">
                      {entry.isCurrent ? (
                        <div className="h-3 w-3 rounded-full dark:bg-[#0846A6]" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <RankBadge rank={entry.rank} size="sm" />
                        <div>
                          <div className="text-white font-medium">
                            {entry.isCurrent ? "Current Rank" : "Achieved"}
                          </div>
                          <div className="text-[#A0AFC0] text-sm">
                            {formatDate(entry.achievedDate)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#A0AFC0] text-sm">{entry.duration}</div>
                        {entry.isCurrent && (
                          <Badge className="bg-[#0846A6]/20 text-[#0846A6] border-[#0846A6]/30 text-xs">ACTIVE</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <Gift className="h-6 w-6 text-[#0846A6]" />
                <span>ALL RANKS & BENEFITS</span>
              </CardTitle>
              <p className="text-[#A0AFC0] text-sm">Complete overview of rank requirements and benefits</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {allRanks.map((rank) => (
                  <Card
                    key={rank.name}
                    className={`border-[#E5E7EB] transition-all duration-200 ${rank.name === currentRank?.name
                      ? "dark:bg-[#0846A6]/5 dark:border-[#0846A6]"
                      : "dark:bg-[#0D0F1A] dark:border-[#E5E7EB] dark:hover:border-[#0846A6]/50"
                      }`}
                  >
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <RankBadge rank={rank.name} size="md" />
                        {rank.name === currentRank?.name && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            CURRENT
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2 uppercase text-sm tracking-wider">REQUIREMENTS</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#A0AFC0]">Volume:</span>
                            <span className="text-white">{rank.requirements.volume}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="dark:text-[#A0AFC0]">Direct Refs:</span>
                            <span className="text-white">{rank.requirements.directReferrals}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="dark:text-[#A0AFC0]">Team Size:</span>
                            <span className="text-white">{rank.requirements.teamSize}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-2 uppercase text-sm tracking-wider">BENEFITS</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#A0AFC0]">Commission:</span>
                            <span className="text-[#0846A6]">{rank.benefits.commission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A0AFC0]">Bonus:</span>
                            <span className="text-[#00B28C]">{rank.benefits.bonus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A0AFC0]">Perks:</span>
                            <span className="text-[#6F00FF]">{rank.benefits.perks}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>*/}
        </div>
      </div>
    </div>
  )
}
