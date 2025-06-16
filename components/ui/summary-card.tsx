import { Card, CardContent } from "@/components/ui/card"

interface SummaryCardProps {
  title: string
  value: string | number
  color?: string
}

export function SummaryCard({ title, value, color = "text-[#00E5FF]" }: SummaryCardProps) {
  return (
    <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
      <CardContent className="p-6 text-center">
        <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
        <div className="text-[#A0AFC0] text-sm uppercase tracking-wider">{title}</div>
      </CardContent>
    </Card>
  )
}
