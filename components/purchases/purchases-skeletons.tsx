import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const PurchasesSummaryCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2].map((i) => (
      <Card key={i} className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
        <CardContent className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-8 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export const PurchasesChartSkeleton = () => (
  <div style={{ width: "70%", transform: "scale(0.9)", transformOrigin: "top left" }} className="mb-4">
    <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-6 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-4 w-64 mt-2 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
          <Skeleton className="h-[300px] w-full bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
        </div>
      </CardContent>
    </Card>
  </div>
)

export const PurchasesTableSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
    <CardContent className="p-6">
      <div className="space-y-4">
        {/* Table header */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-6 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <Skeleton className="h-4 w-64 mt-2 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          </div>
          <Skeleton className="h-10 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>

        {/* Table content */}
        <div className="space-y-4">
          {/* Table headers */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            ))}
          </div>

          {/* Table rows */}
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="grid grid-cols-4 gap-4 py-2">
              <Skeleton className="h-4 w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-28 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
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

export const PurchasesPageSkeleton = () => (
  <div className="min-h-screen">
    <div className="p-6 space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-4 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Summary Cards Skeleton */}
      <PurchasesSummaryCardsSkeleton />

      {/* Filter Controls Skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-4 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-10 w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Chart Skeleton */}
      <PurchasesChartSkeleton />

      {/* Table Skeleton */}
      <PurchasesTableSkeleton />
    </div>
  </div>
) 