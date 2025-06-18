"use client"

import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RankBadge } from "@/components/ranks/rank-badge"
import { ProgressBar } from "@/components/ranks/progress-bar"
import { Trophy, TrendingUp, Calendar, CheckCircle, Target, Gift } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useRanksData } from '@/hooks/use-ranks'
import { Skeleton } from '@/components/ui/skeleton'

export default function RanksPage() {
  const { data, isLoading, isError } = useRanksData()
  if (isLoading) {
    return (
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6 space-y-6">
            <PageHeader title="RANKS" description="Track your rank progression and unlock new benefits" />
            {/* Summary/Metric Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-28 w-full bg-[#2C2F3C] rounded-lg" />
              ))}
            </div>
            {/* Progress Tracker Skeleton */}
            <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-6 w-full">
              <Skeleton className="h-6 w-48 mb-4 bg-[#2C2F3C]" />
              <Skeleton className="h-8 w-1/2 mb-4 bg-[#2C2F3C]" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {[1,2].map(i => (
                    <Skeleton key={i} className="h-6 w-full bg-[#2C2F3C]" />
                  ))}
                </div>
                <div className="space-y-3">
                  {[1,2].map(i => (
                    <Skeleton key={i} className="h-6 w-full bg-[#2C2F3C]" />
                  ))}
                </div>
              </div>
            </div>
            {/* Rank History Skeleton */}
            <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-6 w-full space-y-4">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-14 w-full bg-[#2C2F3C]" />
              ))}
            </div>
            {/* All Ranks & Benefits Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <Skeleton key={i} className="h-48 w-full bg-[#2C2F3C] rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </ModernSidebar>
    )
  }
  if (isError || !data) {
    return (
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6 space-y-6">
            <PageHeader title="RANKS" description="Track your rank progression and unlock new benefits" />
            <div className="text-red-500">Failed to load rank data.</div>
          </div>
        </div>
      </ModernSidebar>
    )
  }
  const { currentRank, nextRankRequirements, rankHistory, allRanks } = data

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="RANKS" description="Track your rank progression and unlock new benefits" />

          <div className="p-6 space-y-6">
            {/* Current Rank Summary Block */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-[#00E5FF]" />
                  <span>CURRENT RANK</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <RankBadge rank={currentRank.name} size="lg" />
                      <div>
                        <div className="text-white text-lg font-bold">RANK ACHIEVED</div>
                        <div className="flex items-center space-x-2 text-[#A0AFC0] text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(currentRank.achievedDate)}</span>
                          <span>({currentRank.monthsAtRank} months ago)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00E5FF] mb-1">{currentRank.totalVolume} ETH</div>
                      <div className="text-[#A0AFC0] text-xs uppercase tracking-wider">TOTAL VOLUME</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#00FFC8] mb-1">{currentRank.teamSize}</div>
                      <div className="text-[#A0AFC0] text-xs uppercase tracking-wider">TEAM SIZE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#6F00FF] mb-1">{currentRank.directReferrals}</div>
                      <div className="text-[#A0AFC0] text-xs uppercase tracking-wider">DIRECT REFS</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker Block */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                  <Target className="h-6 w-6 text-[#00E5FF]" />
                  <span>PROGRESS TO {nextRankRequirements.name}</span>
                </CardTitle>
                <p className="text-[#A0AFC0] text-sm">Complete these requirements to unlock your next rank</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <ProgressBar
                      label="TOTAL VOLUME"
                      current={nextRankRequirements.currentVolume}
                      target={nextRankRequirements.volumeRequired}
                      unit="USDC"
                      color="bg-[#00E5FF]"
                    />
                    <ProgressBar
                      label="DIRECT REFERRALS"
                      current={nextRankRequirements.currentDirectReferrals}
                      target={nextRankRequirements.directReferralsRequired}
                      unit="users"
                      color="bg-[#00FFC8]"
                    />
                  </div>
                  <div className="space-y-4">
                    <ProgressBar
                      label="TEAM SIZE"
                      current={nextRankRequirements.currentTeamSize}
                      target={nextRankRequirements.teamSizeRequired}
                      unit="members"
                      color="bg-[#6F00FF]"
                    />
                    <ProgressBar
                      label="MONTHLY VOLUME"
                      current={nextRankRequirements.currentMonthlyVolume}
                      target={nextRankRequirements.monthlyVolumeRequired}
                      unit="USDC"
                      color="bg-yellow-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rank History Block */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-[#00E5FF]" />
                  <span>RANK HISTORY</span>
                </CardTitle>
                <p className="text-[#A0AFC0] text-sm">Your rank progression timeline</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rankHistory.map((entry, index) => (
                    <div
                      key={entry.rank}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-[#0D0F1A] border border-[#2C2F3C]"
                    >
                      <div className="flex-shrink-0">
                        {entry.isCurrent ? (
                          <div className="h-3 w-3 rounded-full bg-[#00E5FF]" />
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
                            <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30 text-xs">ACTIVE</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ranks Table Block */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                  <Gift className="h-6 w-6 text-[#00E5FF]" />
                  <span>ALL RANKS & BENEFITS</span>
                </CardTitle>
                <p className="text-[#A0AFC0] text-sm">Complete overview of rank requirements and benefits</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {allRanks.map((rank) => (
                    <Card
                      key={rank.name}
                      className={`border-2 transition-all duration-200 ${
                        rank.name === currentRank.name
                          ? "bg-[#00E5FF]/5 border-[#00E5FF]"
                          : "bg-[#0D0F1A] border-[#2C2F3C] hover:border-[#00E5FF]/50"
                      }`}
                    >
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <RankBadge rank={rank.name} size="md" />
                          {rank.name === currentRank.name && (
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
                              <span className="text-[#A0AFC0]">Direct Refs:</span>
                              <span className="text-white">{rank.requirements.directReferrals}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#A0AFC0]">Team Size:</span>
                              <span className="text-white">{rank.requirements.teamSize}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-medium mb-2 uppercase text-sm tracking-wider">BENEFITS</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#A0AFC0]">Commission:</span>
                              <span className="text-[#00E5FF]">{rank.benefits.commission}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#A0AFC0]">Bonus:</span>
                              <span className="text-[#00FFC8]">{rank.benefits.bonus}</span>
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
            </Card>
          </div>
        </div>
      </div>
    </ModernSidebar>
  )
}
