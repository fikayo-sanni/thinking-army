import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const PerformanceCardSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C] col-span-1 md:col-span-1">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div>
            <Skeleton className="h-6 w-24 mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-4 w-12 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-4 w-12 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const CommissionBalancesSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C] col-span-1 md:col-span-1">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div>
            <Skeleton className="h-4 w-40 mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-6 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-12 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-4 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const DownlinesSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C] col-span-1 md:col-span-1">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div>
            <Skeleton className="h-6 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-2 w-2 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
            <Skeleton className="h-4 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const ChartCardSkeleton = ({ title }: { title: string }) => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-[#A0AFC0] uppercase tracking-wider">{title}</h3>
          <Skeleton className="h-4 w-48 mt-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        <Skeleton className="h-64 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
      </div>
    </CardContent>
  </Card>
) 