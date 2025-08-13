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
  className?: string
}

export function MetricCard({ title, value, icon, change, progress }: MetricCardProps) {
  return (
    <Card className="bg-white border-[#E4E6EB] dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
      <CardContent className="p-6">
        <MetricCardContent title={title} value={value} icon={icon} change={change}/>
        {progress && (
          <div className="mt-3">
            <Progress 
              value={progress.value} 
              className="h-2 bg-[#F8F9FB] border-[#E4E6EB] dark:bg-[#1E1E1E] dark:border-[#2A2A2A]" 
            />
            <div className="flex justify-between text-xs text-[#9AA0A6] dark:text-[#A0A0A0] mt-1">
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
      <div className="text-2xl font-medium text-[#202124] dark:text-[#E6E6E6] mb-1">
        {value} {change && (
          <Badge
            className={
              change.type === "positive"
                ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 dark:bg-emerald-400/5 dark:text-emerald-400 dark:border-emerald-400/20"
                : change.type === "negative"
                  ? "bg-red-500/5 text-red-500 border-red-500/20 dark:bg-red-400/5 dark:text-red-400 dark:border-red-400/20"
                  : "bg-[#F8F9FB] text-[#9AA0A6] border-[#E4E6EB] dark:bg-[#1E1E1E] dark:text-[#A0A0A0] dark:border-[#2A2A2A]"
            }
          >
            {change.value}
          </Badge>
        )}
      </div>
      <div className="text-[#9AA0A6] dark:text-[#A0A0A0] text-sm font-medium">{title}</div>
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
    <Card className={cn("bg-white border-[#E4E6EB] dark:bg-[#1E1E1E] dark:border-[#2A2A2A]", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-[#297EFF]/5 dark:bg-[#4D8DFF]/5 flex-shrink-0">
            <Icon className="h-5 w-5 text-[#297EFF] dark:text-[#4D8DFF]" />
          </div>
          {change && (
            <Badge 
              className={cn(
                "text-xs px-2 py-1",
                change.type === "positive" 
                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 dark:bg-emerald-400/5 dark:text-emerald-400 dark:border-emerald-400/20"
                  : change.type === "negative"
                  ? "bg-red-500/5 text-red-500 border-red-500/20 dark:bg-red-400/5 dark:text-red-400 dark:border-red-400/20"
                  : "bg-[#F8F9FB] text-[#9AA0A6] border-[#E4E6EB] dark:bg-[#1E1E1E] dark:text-[#A0A0A0] dark:border-[#2A2A2A]"
              )}
            >
              {change.value}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <div className="text-xl sm:text-2xl font-medium text-[#202124] dark:text-[#E6E6E6]">{value}</div>
          <div className="text-[#9AA0A6] dark:text-[#A0A0A0] text-sm font-medium">{title}</div>
        </div>
      </CardContent>
    </Card>
  )
}
