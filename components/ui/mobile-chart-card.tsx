import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MobileChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  height?: number
}

export function MobileChartCard({ 
  title, 
  description, 
  children, 
  className = "",
  height = 200
}: MobileChartCardProps) {
  return (
    <Card className={cn("dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base mobile-text-lg tracking-wide">
          {title}
        </CardTitle>
        {description && (
          <p className="text-[#A0AFC0] text-sm mobile-text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mobile-scroll" style={{ height: `${height}px`, width: '100%' }}>
          {children}
        </div>
      </CardContent>
    </Card>
  )
} 