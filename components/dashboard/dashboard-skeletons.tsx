import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const PerformanceCardSkeleton = () => (
  <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card col-span-1 md:col-span-1">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div>
            <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-3 sm:h-4 w-32 sm:w-40 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 sm:h-6 w-12 sm:w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const CommissionBalancesSkeleton = () => (
  <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card col-span-1 md:col-span-1">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div>
            <Skeleton className="h-3 sm:h-4 w-32 sm:w-40 mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const DownlinesSkeleton = () => (
  <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card col-span-1 md:col-span-1">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div>
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-2 w-2 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
            <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const ChartCardSkeleton = ({ title }: { title: string }) => (
  <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
    <CardContent className="p-4 sm:p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-[#A0AFC0] uppercase tracking-wider">{title}</h3>
          <Skeleton className="h-3 sm:h-4 w-32 sm:w-48 mt-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        <Skeleton className="h-48 sm:h-64 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
      </div>
    </CardContent>
  </Card>
)

export const DashboardPageSkeleton = () => (
  <div className="min-h-screen">
    <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <PerformanceCardSkeleton />
        <CommissionBalancesSkeleton />
        <DownlinesSkeleton />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <ChartCardSkeleton title="EARNINGS CHART" />
        <ChartCardSkeleton title="PERFORMANCE CHART" />
      </div>
    </div>
  </div>
) 