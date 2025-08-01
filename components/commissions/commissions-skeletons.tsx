import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const CommissionsSummaryCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
    {/* Total Earned Card - Full width on mobile */}
    <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card col-span-1 sm:col-span-2 lg:col-span-1">
      <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-6 w-16 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </CardContent>
    </Card>

    {/* Commission Types Breakdown Card */}
    <Card className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB] mobile-card sm:col-span-2 lg:col-span-1 flex flex-col justify-center">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            <div>
              <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {["C1 Direct Sales", "C2 Team Sales", "C3 Team Matching"].map((label, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Pending Commissions Card */}
    <Card className="dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card sm:col-span-2 lg:col-span-1">
      <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-6 w-16 rounded-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 mb-1 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </CardContent>
    </Card>
  </div>
)

export const CommissionsTableSkeleton = () => (
  <div className="dark:bg-[#1A1E2D] border border-[#E5E7EB] dark:border-[#E5E7EB] rounded-lg p-0 w-full">
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
      <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 mb-2 sm:mb-4 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mb-2 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
    </div>
    
    {/* Mobile Card Layout */}
    <div className="block md:hidden px-4 pb-4 space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="border border-[#E5E7EB] dark:border-[#2C2F3C] rounded-lg p-4 space-y-3">
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
              <Skeleton className="h-3 w-16 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              <Skeleton className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
            </div>
          </div>
          <Skeleton className="h-3 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
      ))}
    </div>
    
    {/* Desktop Table Layout */}
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-[#E5E7EB] dark:divide-[#E5E7EB]">
        <thead>
          <tr>
            {["Date", "Source User", "Type", "Amount", "Description"].map((col) => (
              <th key={col} className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">
                <Skeleton className="h-4 w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#E5E7EB]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <tr key={i}>
              {[1, 2, 3, 4, 5].map(j => (
                <td key={j} className="px-4 py-2 whitespace-nowrap">
                  <Skeleton className="h-6 w-full bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Pagination */}
    <div className="block md:hidden px-4 pb-4 pt-2 space-y-4">
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
    <div className="hidden md:block px-6 pb-4 pt-2">
      <div className="flex items-center justify-between">
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
)

export const CommissionsPendingSkeleton = () => (
  <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
    <CardContent className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
          <Skeleton className="h-4 w-16 sm:w-20 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border border-[#2C2F3C] rounded-lg">
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

export const CommissionsChartSkeleton = () => (
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

export const CommissionsPageSkeleton = () => (
  <div className="min-h-screen">
    <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
      </div>

      {/* Summary Cards Skeleton */}
      <CommissionsSummaryCardsSkeleton />

      {/* Mobile Filter Controls Skeleton */}
      <div className="space-y-3 sm:space-y-4">
        <Skeleton className="h-4 w-20 sm:w-24 bg-[#F9F8FC] dark:bg-[#2C2F3C]" />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Skeleton className="h-12 w-full sm:w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
          <Skeleton className="h-12 w-full sm:w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
          <Skeleton className="h-12 w-full sm:w-48 bg-[#F9F8FC] dark:bg-[#2C2F3C] rounded-lg" />
        </div>
      </div>

      {/* Pending Commissions Skeleton */}
      <CommissionsPendingSkeleton />

      {/* Chart Skeleton */}
      <CommissionsChartSkeleton />

      {/* Table Skeleton */}
      <CommissionsTableSkeleton />
    </div>
  </div>
) 