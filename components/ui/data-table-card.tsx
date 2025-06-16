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
    <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white uppercase tracking-wide text-xl">{title}</CardTitle>
            {subtitle && <p className="text-[#A0AFC0] text-sm mt-1">{subtitle}</p>}
          </div>
          {showExport && (
            <Button
              variant="outline"
              onClick={onExport}
              className="border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF]"
            >
              Export Data
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
