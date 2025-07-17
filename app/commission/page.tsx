import React from "react";
import { ModernSidebar } from "@/components/layout/modern-sidebar";
import { ModernHeader } from "@/components/layout/modern-header";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommissionPage() {
  // TODO: Replace with real loading logic
  const isLoading = true;

  if (isLoading) {
    return (
      <ModernSidebar>
        <div className="min-h-screen">
          <ModernHeader />
          <div className="p-6 space-y-6">
            <PageHeader title="COMMISSIONS" description="Track your commission earnings and history" />
            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-28 w-full bg-[#2C2F3C] rounded-lg" />
              ))}
            </div>
            {/* Table Skeleton */}
            <div className="bg-[#1A1E2D] border border-[#2C2F3C] rounded-lg p-0 w-full">
              <div className="px-6 pt-6 pb-2">
                <Skeleton className="h-6 w-48 mb-4 dark:bg-[#2C2F3C]" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2C2F3C]">
                  <thead>
                    <tr>
                      {["Date","Amount","Type","Source","Status","Description","Currency"].map((col) => (
                        <th key={col} className="px-4 py-2 text-left text-xs font-medium text-[#A0AFC0] uppercase">
                          <Skeleton className="h-4 w-20 dark:bg-[#2C2F3C]" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C2F3C]">
                    {[1,2,3,4,5].map(i => (
                      <tr key={i}>
                        {[1,2,3,4,5,6,7].map(j => (
                          <td key={j} className="px-4 py-2 whitespace-nowrap">
                            <Skeleton className="h-6 w-full dark:bg-[#2C2F3C]" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </ModernSidebar>
    )
  }

  // TODO: Add main content for when not loading
  return null;
} 