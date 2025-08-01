import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: {
    value: string
    type: "positive" | "negative" | "neutral"
  }
  progress?: {
    value: number
    label: string
  }
}

export function MetricCard({ title, value, icon, change, progress }: MetricCardProps) {
  return (
    <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#2C2F3C]">
      <CardContent className="p-6">
        <MetricCardContent title={title} value={value} icon={icon} change={change}/>
        {progress && (
          <div className="mt-3">
            <Progress value={progress.value} className="h-2 border-[#E5E7EB] dark:bg-[#2C2F3C]" />
            <div className="flex justify-between text-xs text-[#A0AFC0] mt-1">
              <span>{progress.label}</span>
              <span>{progress.value}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricCardContent({ title, value, icon: Icon, change, progress }: MetricCardProps) {
  return (
    <div>
        <div className="text-2xl font-bold mb-1 text-white">{value} {change && (
            <Badge
              className={
                change.type === "positive"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : change.type === "negative"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-[#2C2F3C] text-[#A0AFC0]"
              }
            >
              {change.value}
            </Badge>
          )}</div>
        <div className="text-[#A0AFC0] text-xs uppercase tracking-wider">{title}</div>
    </div>
  )
}

export function MobileMetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  className = "" 
}: MetricCardProps) {
  return (
    <Card className={cn("dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-[#0846A6]/10 flex-shrink-0">
            <Icon className="h-5 w-5 text-[#0846A6]" />
          </div>
          {change && (
            <Badge 
              className={cn(
                "text-xs px-2 py-1",
                change.type === "positive" 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : change.type === "negative"
                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
              )}
            >
              {change.value}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <div className="text-xl sm:text-2xl font-bold text-white mobile-text-lg">{value}</div>
          <div className="text-[#A0AFC0] text-xs uppercase tracking-wider mobile-text-sm">{title}</div>
        </div>
      </CardContent>
    </Card>
  )
}
