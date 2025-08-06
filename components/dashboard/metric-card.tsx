import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { LucideIcon } from "lucide-react"

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

export function MetricCard({ title, value, icon: Icon, change, progress }: MetricCardProps) {
  return (
    <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-[#0846A6]/10">
            <Icon className="h-6 w-6 text-[#0846A6]" />
          </div>
          {change && (
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
          )}
        </div>
        <div className="text-3xl font-bold mb-1 text-white">{value}</div>
        <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">{title}</div>
        {progress && (
          <div className="mt-3">
            <Progress value={progress.value} className="h-2 dark:bg-[#2C2F3C]" />
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
