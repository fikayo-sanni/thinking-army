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
          className="w-full h-9 flex items-center justify-between bg-white hover:bg-[#F8F9FB] dark:bg-[#1E1E1E] dark:hover:bg-[#1E1E1E] border-[#E4E6EB] hover:border-[#297EFF] dark:border-[#2A2A2A] dark:hover:border-[#4D8DFF] text-[#202124] dark:text-[#E6E6E6] mb-3"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]" />
          )}
        </Button>
        
        {isExpanded && (
          <div className="border border-[#E4E6EB] dark:border-[#2A2A2A] rounded-lg p-4 mb-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] space-y-3">
            {children}
          </div>
        )}
      </div>

      {/* Desktop Always Visible */}
      <div className="hidden md:block">
        <div className="flex flex-col sm:flex-row gap-3">
          {children}
        </div>
      </div>
    </>
  );
} 