"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DataTableCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  showExport?: boolean
  onExport?: () => void
}

export function DataTableCard({ title, subtitle, children, showExport = false, onExport }: DataTableCardProps) {
  return (
    <Card className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-[#E5E7EB]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white uppercase tracking-wide text-xl">{title}</CardTitle>
            {subtitle && <p className="text-[#A0AFC0] text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
