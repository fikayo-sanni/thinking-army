import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface ModernCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: {
    value: string
    type: "positive" | "negative" | "neutral"
  }
  gradient?: string
  children?: React.ReactNode
}

export function ModernCard({
  title,
  value,
  icon: Icon,
  change,
  gradient = "from-[#0846A6] to-[#6F00FF]",
  children,
}: ModernCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[#1A1E2D]/80 to-[#2C2F3C]/40 backdrop-blur border border-[#E5E7EB]/50 hover:border-[#0846A6]/30 transition-all duration-300 group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0846A6]/5 to-[#6F00FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {change && (
            <Badge
              className={`${
                change.type === "positive"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : change.type === "negative"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-[#2C2F3C] text-[#A0AFC0]"
              } shadow-sm`}
            >
              {change.value}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-[#A0AFC0] bg-clip-text text-transparent">
          {value}
        </div>
        <div className="text-[#A0AFC0] text-sm uppercase tracking-wider font-medium">{title}</div>
        {children}
      </CardContent>
    </Card>
  )
}
