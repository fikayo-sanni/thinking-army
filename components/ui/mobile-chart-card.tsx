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
    <Card className={cn(
      "bg-white dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A] mobile-card",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-[#202124] dark:text-[#E6E6E6] text-base mobile-text-lg font-medium">
          {title}
        </CardTitle>
        {description && (
          <p className="text-[#9AA0A6] dark:text-[#A0A0A0] text-sm mobile-text-sm">
            {description}
          </p>
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