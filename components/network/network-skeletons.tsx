import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SummaryCard } from "@/components/ui/summary-card"

export const NetworkStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
      <CardContent className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-6 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-8 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
      </CardContent>
    </Card>

    <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
      <CardContent className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-36 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-6 w-28 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-8 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
      </CardContent>
    </Card>
  </div>
)

export const NetworkStructureSkeleton = () => (
  <Card className="dark:bg-[#1A1E2D] dark:border-[#2C2F3C] border-[#E5E7EB]">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-6 w-40 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>
      <Skeleton className="h-4 w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex justify-center">
        <div className="space-y-6">
          {/* Main user node skeleton */}
          <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-[#E5E7EB] rounded-lg">
            <Skeleton className="h-16 w-16 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <div className="text-center space-y-2">
              <Skeleton className="h-5 w-24 bg-[#E5E7EB] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-32 bg-[#E5E7EB] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-20 bg-[#E5E7EB] dark:bg-[#2C2F3C]" />
            </div>
          </div>
          
          {/* Downlines skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center space-y-3 p-4 border border-[#E5E7EB] rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                <div className="text-center space-y-2">
                  <Skeleton className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                  <Skeleton className="h-3 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                  <Skeleton className="h-3 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
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
    <div className="p-6 space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-4 w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Stats Skeleton */}
      <NetworkStatsSkeleton />

      {/* Filter Controls Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-10 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Main Structure Skeleton */}
      <NetworkStructureSkeleton />
    </div>
  </div>
) 