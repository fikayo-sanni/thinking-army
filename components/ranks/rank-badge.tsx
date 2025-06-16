import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Crown, Star, Diamond, Gem } from "lucide-react"

interface RankBadgeProps {
  rank: string
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export function RankBadge({ rank, size = "md", showIcon = true }: RankBadgeProps) {
  const getRankConfig = (rankName: string) => {
    const configs = {
      BRONZE: {
        color: "bg-amber-600/20 text-amber-400 border-amber-600/30",
        icon: Award,
      },
      SILVER: {
        color: "bg-gray-400/20 text-gray-300 border-gray-400/30",
        icon: Star,
      },
      GOLD: {
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        icon: Trophy,
      },
      PLATINUM: {
        color: "bg-blue-400/20 text-blue-300 border-blue-400/30",
        icon: Gem,
      },
      DIAMOND: {
        color: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
        icon: Diamond,
      },
      ELITE: {
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        icon: Crown,
      },
    }
    return configs[rankName as keyof typeof configs] || configs.BRONZE
  }

  const config = getRankConfig(rank)
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} flex items-center space-x-1`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{rank}</span>
    </Badge>
  )
}
