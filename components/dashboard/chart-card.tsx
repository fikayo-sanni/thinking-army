import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
      <CardHeader>
        <CardTitle className="text-white uppercase tracking-wide">{title}</CardTitle>
        {description && <CardDescription className="text-[#A0AFC0]">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
