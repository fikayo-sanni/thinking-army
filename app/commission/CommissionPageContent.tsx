'use client';

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CommissionPageContent() {
  // TODO: Replace with real loading logic
  const isLoading = true;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="COMMISSIONS" description="Track your commission earnings and history" />
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-28 w-full" />
            </Card>
          ))}
        </div>
        {/* Table Skeleton */}
        <Card>
          <div className="px-6 pt-6 pb-2">
            <Skeleton className="h-6 w-48 mb-4" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  {["Date","Amount","Type","Source","Status","Description","Currency"].map((col) => (
                    <th key={col} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[1,2,3,4,5].map(i => (
                  <tr key={i}>
                    {[1,2,3,4,5,6,7].map(j => (
                      <td key={j} className="px-4 py-2 whitespace-nowrap">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // TODO: Add main content for when not loading
  return null;
} 