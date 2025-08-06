import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const PayoutsStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className={`dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card ${i === 3 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
        <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-6 w-16 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
          <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </CardContent>
      </Card>
    ))}
  </div>
)

export const PayoutsTableSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
    <CardContent className="p-4 sm:p-6">
      <div className="space-y-4">
        {/* Table header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-8 sm:h-10 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>

        {/* Mobile Card Layout */}
        <div className="block md:hidden space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="border border-[#E5E7EB] dark:border-[#E5E7EB] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                <Skeleton className="h-6 w-12 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-12 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                  <Skeleton className="h-4 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-8 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                  <Skeleton className="h-4 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                </div>
              </div>
              <Skeleton className="h-3 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block space-y-4">
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

        {/* Mobile Pagination */}
        <div className="block md:hidden space-y-4 pt-2">
          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-3 w-24 mx-auto bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-12 flex-1 bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
            <Skeleton className="h-12 flex-1 bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
        </div>

        {/* Desktop Pagination */}
        <div className="hidden md:block">
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
      </div>
    </CardContent>
  </Card>
)

export const PayoutsPendingSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
    <CardContent className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-8 sm:h-10 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                <Skeleton className="h-3 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              </div>
              <Skeleton className="h-6 w-12 sm:w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)

export const PayoutsChartSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
    <CardContent className="p-4 sm:p-6">
      <div className="space-y-4">
        <div>
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mt-2 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        <Skeleton className="h-48 sm:h-64 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
      </div>
    </CardContent>
  </Card>
)

export const PayoutsPageSkeleton = () => (
  <div className="min-h-screen">
    <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 sm:h-8 w-20 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Stats Skeleton */}
      <PayoutsStatsSkeleton />

      {/* Mobile Filter Controls Skeleton */}
      <div className="space-y-3 sm:space-y-4">
        <Skeleton className="h-4 w-16 sm:w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Skeleton className="h-12 w-full sm:w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
          <Skeleton className="h-12 w-full sm:w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
        </div>
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