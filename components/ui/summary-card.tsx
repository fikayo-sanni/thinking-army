import { Card, CardContent } from "@/components/ui/card"

interface SummaryCardProps {
  title: string
  value: string | number
  color?: string
  subtitle?: string
}

export function SummaryCard({ title, value, subtitle, color = "text-[#297EFF] dark:text-[#4D8DFF]" }: SummaryCardProps) {
  return (
    <Card className="bg-white dark:bg-[#1E1E1E] border-[#E4E6EB] dark:border-[#2A2A2A]">
      <CardContent className="p-4">
        <div className={`text-xl font-medium ${color} mb-1`}>{value}</div>
        <div className="text-[#9AA0A6] dark:text-[#A0A0A0] text-sm font-medium">{title}</div>
        {subtitle && (
          <div className="text-[#9AA0A6] dark:text-[#A0A0A0] text-sm mt-1">{subtitle}</div>
        )}
      </CardContent>
    </Card>
  )
}
