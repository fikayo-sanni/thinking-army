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
    <Card className="bg-white border-[#E4E6EB] dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#202124] dark:text-[#E6E6E6] text-lg font-medium tracking-normal">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-[#9AA0A6] dark:text-[#A0A0A0] text-sm mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {showExport && (
            <Button
              onClick={onExport}
              variant="outline"
              size="sm"
              className="border-[#E4E6EB] hover:border-[#297EFF] hover:text-[#297EFF] dark:border-[#2A2A2A] dark:hover:border-[#4D8DFF] dark:hover:text-[#4D8DFF]"
            >
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
