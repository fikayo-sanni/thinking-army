import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryCard } from "@/components/ui/summary-card"

export const NetworkStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
    <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-6 sm:h-8 w-16 sm:w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
      </CardContent>
    </Card>

    <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <Skeleton className="h-3 sm:h-4 w-28 sm:w-36 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-5 sm:h-6 w-22 sm:w-28 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
      </CardContent>
    </Card>
  </div>
)

export const NetworkStructureSkeleton = () => (
  <Card className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB] mobile-card">
    <CardHeader className="p-4 sm:p-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 sm:h-5 w-4 sm:w-5 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>
      <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
    </CardHeader>
    <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex justify-center">
        <div className="space-y-4 sm:space-y-6">
          {/* Main user node skeleton */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 p-4 sm:p-6 border-2 border-dashed border-[#E5E7EB] rounded-lg">
            <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <div className="text-center space-y-2">
              <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 bg-[#E5E7EB] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 bg-[#E5E7EB] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 bg-[#E5E7EB] dark:bg-[#2C2F3C]" />
            </div>
          </div>
          
          {/* Downlines skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 border border-[#E5E7EB] rounded-lg">
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                <div className="text-center space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                  <Skeleton className="h-3 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                  <Skeleton className="h-3 w-12 sm:w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const NetworkPageSkeleton = () => (
  <div className="min-h-screen">
    <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 sm:h-8 w-32 sm:w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Stats Skeleton */}
      <NetworkStatsSkeleton />

      {/* Filter Controls Skeleton */}
      <div className="space-y-3 sm:space-y-4">
        <Skeleton className="h-4 w-16 sm:w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Skeleton className="h-12 w-full sm:w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
        </div>
      </div>

      {/* Main Structure Skeleton */}
      <NetworkStructureSkeleton />
    </div>
  </div>
) 