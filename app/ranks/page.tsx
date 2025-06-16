"use client"

import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RankBadge } from "@/components/ranks/rank-badge"
import { ProgressBar } from "@/components/ranks/progress-bar"
import { Trophy, TrendingUp, Calendar, CheckCircle, Target, Gift } from "lucide-react"

// Mock data for current user rank
const currentRank = {
  name: "GOLD",
  achievedDate: "2023-08-15",
  totalVolume: 45.7,
  teamSize: 12,
  directReferrals: 8,
  monthsAtRank: 5,
}

// Requirements for next rank (Platinum)
const nextRankRequirements = {
  name: "PLATINUM",
  volumeRequired: 100,
  currentVolume: 45.7,
  directReferralsRequired: 15,
  currentDirectReferrals: 8,
  teamSizeRequired: 25,
  currentTeamSize: 12,
  monthlyVolumeRequired: 10,
  currentMonthlyVolume: 8.5,
}

// Rank history data
const rankHistory = [
  {
    rank: "GOLD",
    achievedDate: "2023-08-15",
    duration: "5 months",
    isCurrent: true,
  },
  {
    rank: "SILVER",
    achievedDate: "2023-05-20",
    duration: "3 months",
    isCurrent: false,
  },
  {
    rank: "BRONZE",
    achievedDate: "2023-03-10",
    duration: "2 months",
    isCurrent: false,
  },
]

// All available ranks with requirements and benefits
const allRanks = [
  {
    name: "BRONZE",
    requirements: {
      volume: "5 ETH",
      directReferrals: "2",
      teamSize: "3",
    },
    benefits: {
      commission: "5%",
      bonus: "Welcome Bonus",
      perks: "Basic Support",
    },
  },
  {
    name: "SILVER",
    requirements: {
      volume: "15 ETH",
      directReferrals: "5",
      teamSize: "8",
    },
    benefits: {
      commission: "7%",
      bonus: "Monthly Bonus",
      perks: "Priority Support",
    },
  },
  {
    name: "GOLD",
    requirements: {
      volume: "35 ETH",
      directReferrals: "8",
      teamSize: "12",
    },
    benefits: {
      commission: "10%",
      bonus: "Quarterly Bonus",
      perks: "VIP Support",
    },
  },
  {
    name: "PLATINUM",
    requirements: {
      volume: "100 ETH",
      directReferrals: "15",
      teamSize: "25",
    },
    benefits: {
      commission: "12%",
      bonus: "Leadership Bonus",
      perks: "Exclusive Events",
    },
  },
  {
    name: "DIAMOND",
    requirements: {
      volume: "250 ETH",
      directReferrals: "25",
      teamSize: "50",
    },
    benefits: {
      commission: "15%",
      bonus: "Diamond Bonus",
      perks: "Personal Manager",
    },
  },
  {
    name: "ELITE",
    requirements: {
      volume: "500 ETH",
      directReferrals: "50",
      teamSize: "100",
    },
    benefits: {
      commission: "20%",
      bonus: "Elite Rewards",
      perks: "All Benefits",
    },
  },
]

export default function RanksPage() {
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
                          <span>{new Date(currentRank.achievedDate).toLocaleDateString()}</span>
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
                      unit="ETH"
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
                      unit="ETH"
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
                              {new Date(entry.achievedDate).toLocaleDateString()}
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
