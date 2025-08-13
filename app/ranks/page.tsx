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
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-semibold text-[#202124] dark:text-[#E6E6E6]">
            Ranks
          </h1>
        </div>
      </div>

      {/* Main Content with Right Panel */}
      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Current Rank Summary */}
          {currentRank && currentRankRequirements ? (
            <div className={cardStyles.base}>
              <div className={cardStyles.header}>
                <div className={cardStyles.headerLeft}>
                  <div className={cardStyles.iconContainer}>
                    <Trophy className={cardStyles.icon} />
                  </div>
                  <div>
                    <h3 className={cardStyles.title}>Current Rank</h3>
                    <p className={cardStyles.subtitle}>Your current rank and achievements</p>
                  </div>
                </div>
                <RankBadge rank={currentRank.name} size="lg" />
              </div>
              <div className={cardStyles.content}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-[#202124] dark:text-[#E6E6E6] text-lg font-medium">Rank Achieved</div>
                        {currentRank && (
                          <div className="flex items-center space-x-2 text-[#5F6368] dark:text-[#A0A0A0] text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(currentRank.achievedDate)}</span>
                            <span>({currentRank.monthsAtRank} months ago)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className={cardStyles.metric.container}>
                      <div>
                        <div className={cardStyles.metric.value}>{currentRank.totalVolume} VP</div>
                        <div className={cardStyles.metric.label}>Total Volume</div>
                      </div>
                    </div>
                    <div className={cardStyles.metric.container}>
                      <div>
                        <div className={cardStyles.metric.value}>{currentRank.teamSize}</div>
                        <div className={cardStyles.metric.label}>Team Size</div>
                      </div>
                    </div>
                    <div className={cardStyles.metric.container}>
                      <div>
                        <div className={cardStyles.metric.value}>{currentRank.directReferrals}</div>
                        <div className={cardStyles.metric.label}>Direct Refs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Progress Tracker */}
          {currentRank && currentRankRequirements ? (
            <div className={cardStyles.base}>
              <div className={cardStyles.header}>
                <div className={cardStyles.headerLeft}>
                  <div className={cardStyles.iconContainer}>
                    <Target className={cardStyles.icon} />
                  </div>
                  <div>
                    <h3 className={cardStyles.title}>Rank Progress</h3>
                    <p className={cardStyles.subtitle}>Track your progress to maintain your current rank</p>
                  </div>
                </div>
              </div>
              <div className={cardStyles.content}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <ProgressBar
                      label="TOTAL VOLUME"
                      current={currentRank.totalVolume}
                      target={parseInt(currentRankRequirements.requirements.volume.replace(/[^0-9]/g, ''))}
                      unit="VP"
                      color="bg-[#297EFF]"
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
                      color="bg-[#FF6B00]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* All Ranks & Benefits */}
          <div className={cardStyles.base}>
            <div className={cardStyles.header}>
              <div className={cardStyles.headerLeft}>
                <div className={cardStyles.iconContainer}>
                  <Gift className={cardStyles.icon} />
                </div>
                <div>
                  <h3 className={cardStyles.title}>All Ranks & Benefits</h3>
                  <p className={cardStyles.subtitle}>Complete overview of rank requirements and benefits</p>
                </div>
              </div>
            </div>
            <div className={cardStyles.content}>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {allRanks.map((rank) => (
                  <div
                    key={rank.name}
                    className={`${cardStyles.base} ${
                      rank.name === currentRank?.name
                        ? "dark:bg-[#297EFF]/5 dark:border-[#297EFF]"
                        : "hover:border-[#297EFF]/50"
                    }`}
                  >
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <RankBadge rank={rank.name} size="md" />
                        {rank.name === currentRank?.name && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            CURRENT
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h4 className="text-[#202124] dark:text-[#E6E6E6] font-medium mb-2 uppercase text-sm tracking-wider">REQUIREMENTS</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#5F6368] dark:text-[#A0A0A0]">Volume:</span>
                            <span className="text-[#202124] dark:text-[#E6E6E6]">{rank.requirements.volume}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#5F6368] dark:text-[#A0A0A0]">Direct Refs:</span>
                            <span className="text-[#202124] dark:text-[#E6E6E6]">{rank.requirements.directReferrals}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#5F6368] dark:text-[#A0A0A0]">Team Size:</span>
                            <span className="text-[#202124] dark:text-[#E6E6E6]">{rank.requirements.teamSize}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[#202124] dark:text-[#E6E6E6] font-medium mb-2 uppercase text-sm tracking-wider">BENEFITS</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#5F6368] dark:text-[#A0A0A0]">Commission:</span>
                            <span className="text-[#297EFF]">{rank.benefits.commission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#5F6368] dark:text-[#A0A0A0]">Bonus:</span>
                            <span className="text-[#00B28C]">{rank.benefits.bonus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#5F6368] dark:text-[#A0A0A0]">Perks:</span>
                            <span className="text-[#6F00FF]">{rank.benefits.perks}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Current Rank</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {currentRank ? (
                      <RankBadge rank={currentRank.name} size="sm" showIcon={false} />
                    ) : (
                      <Skeleton className="h-4 w-16 dark:bg-[#2C2F3C] rounded" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Total Volume</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {currentRank ? (
                      `${currentRank.totalVolume} VP`
                    ) : (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Team Size</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {currentRank ? (
                      currentRank.teamSize
                    ) : (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">Direct Referrals</span>
                  <span className="text-[14px] font-medium text-[#202124] dark:text-[#E6E6E6]">
                    {currentRank ? (
                      currentRank.directReferrals
                    ) : (
                      <Skeleton className="h-4 w-12 dark:bg-[#2C2F3C] rounded" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Rank History Section */}
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-wider text-[#5F6368] dark:text-[#A0A0A0] mb-4">
                Rank History
              </h3>
              <div className="space-y-4">
                {rankHistory ? (
                  rankHistory.slice(0, 5).map((entry) => (
                    <div key={entry.rank} className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-[#297EFF]/10">
                        <Trophy className="h-4 w-4 text-[#297EFF]" />
                      </div>
                      <div>
                        <p className="text-[14px] text-[#202124] dark:text-[#E6E6E6]">
                          Achieved {entry.rank}
                        </p>
                        <span className="text-[12px] text-[#5F6368] dark:text-[#A0A0A0]">
                          {formatDate(entry.achievedDate)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0] text-center">
                    No rank history available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
