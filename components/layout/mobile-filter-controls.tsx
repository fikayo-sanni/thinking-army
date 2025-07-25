"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

interface MobileFilterControlsProps {
  children: React.ReactNode;
  title?: string;
}

export function MobileFilterControls({ children, title = "Filters" }: MobileFilterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile Collapsible Filter */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-12 flex items-center justify-between dark:bg-[#1A1E2D] dark:border-[#2C2F3C] dark:text-white border-[#E5E7EB] text-gray-900 mb-4"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">{title}</span>
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {isExpanded && (
          <div className="border border-[#E5E7EB] dark:border-[#2C2F3C] rounded-lg p-4 mb-4 bg-white dark:bg-[#1A1E2D] space-y-4">
            {children}
          </div>
        )}
      </div>

      {/* Desktop Always Visible */}
      <div className="hidden md:block">
        <div className="flex flex-col sm:flex-row gap-4">
          {children}
        </div>
      </div>
    </>
  );
} 