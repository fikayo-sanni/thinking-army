import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const PayoutsStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Icon and title */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                <Skeleton className="h-6 w-20 mt-2 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              </div>
            </div>
            
            {/* Change indicator */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-6 w-12 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export const PayoutsTableSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
    <CardContent className="p-6">
      <div className="space-y-4">
        {/* Table header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-10 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>

        {/* Table content */}
        <div className="space-y-4">
          {/* Table headers */}
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            ))}
          </div>

          {/* Table rows */}
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="grid grid-cols-5 gap-4 py-2">
              <Skeleton className="h-4 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-6 w-20 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-4 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-8 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-8 w-8 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-8 w-8 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-8 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const PayoutsPendingSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                <Skeleton className="h-3 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              </div>
              <Skeleton className="h-6 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)

export const PayoutsChartSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div>
          <Skeleton className="h-6 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-4 w-64 mt-2 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        <Skeleton className="h-64 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
      </div>
    </CardContent>
  </Card>
)

export const PayoutsPageSkeleton = () => (
  <div className="min-h-screen">
    <div className="p-6 space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-4 w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Stats Skeleton */}
      <PayoutsStatsSkeleton />

      {/* Filter Controls Skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-4 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-10 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Pending Payouts Skeleton */}
      <PayoutsPendingSkeleton />

      {/* Chart Skeleton */}
      <PayoutsChartSkeleton />

      {/* Table Skeleton */}
      <PayoutsTableSkeleton />
    </div>
  </div>
) 