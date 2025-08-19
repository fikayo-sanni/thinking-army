import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string; // Make className optional
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Card className={cn(
      "bg-white  border border-[#E4E6EB] dark:border-[#2A2A2A] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-medium text-[#202124] dark:text-[#E6E6E6]">
              {title}
            </h3>
            <p className="text-[14px] text-[#5F6368] dark:text-[#A0A0A0]">
              {description}
            </p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
