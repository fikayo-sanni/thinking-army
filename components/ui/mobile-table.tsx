"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card"

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
  mobileLabel?: string; // Custom label for mobile view
  hiddenOnMobile?: boolean; // Hide this column on mobile
}

interface MobileTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  emptyMessage?: string;
  className?: string;
}

export function MobileTable({ 
  columns, 
  data, 
  keyField, 
  emptyMessage = "No data found",
  className = ""
}: MobileTableProps) {
  const visibleColumns = columns.filter(col => !col.hiddenOnMobile);

  if (data.length === 0) {
    return (
      <div className="text-center py-12 dark:text-[#A0AFC0]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className={`min-w-full divide-y divide-[#E5E7EB] ${className}`}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-2 text-left text-xs font-medium dark:text-[#A0AFC0] uppercase"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {data.map((row) => (
              <tr key={row[keyField]}>
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2 whitespace-nowrap">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <Card key={row[keyField]} className="dark:bg-[#1A1E2D] dark:border-[#E5E7EB] border-[#E5E7EB]">
            <CardContent className="p-4 space-y-3">
              {visibleColumns.map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium dark:text-[#A0AFC0] text-gray-600 min-w-[100px]">
                    {column.mobileLabel || column.header}:
                  </span>
                  <div className="flex-1 text-right">
                    {column.render ? column.render(row[column.key], row) : (
                      <span className="text-sm dark:text-white text-gray-900">
                        {row[column.key]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
} 