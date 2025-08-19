"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-[#202124] dark:text-[#E6E6E6]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-white hover:bg-[#F8F9FB]  dark:hover:bg-[#1E1E1E] border-[#E4E6EB] hover:border-[#297EFF] dark:border-[#2A2A2A] dark:hover:border-[#4D8DFF] p-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-[#9AA0A6] dark:text-[#A0A0A0] rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          "[&:has([aria-selected])]:bg-[#EAF3FF] dark:[&:has([aria-selected])]:bg-[#1A2B45]",
          "[&:has([aria-selected].day-outside)]:bg-[#EAF3FF]/50 dark:[&:has([aria-selected].day-outside)]:bg-[#1A2B45]/50",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-[#202124] dark:text-[#E6E6E6] aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-[#297EFF] dark:bg-[#4D8DFF] text-white hover:bg-[#297EFF] hover:text-white",
          "dark:hover:bg-[#4D8DFF] dark:hover:text-white",
          "focus:bg-[#297EFF] focus:text-white dark:focus:bg-[#4D8DFF] dark:focus:text-white"
        ),
        day_today: "bg-[#F8F9FB]  text-[#297EFF] dark:text-[#4D8DFF]",
        day_outside: cn(
          "day-outside text-[#9AA0A6] dark:text-[#A0A0A0] aria-selected:bg-[#EAF3FF]/50",
          "dark:aria-selected:bg-[#1A2B45]/50 aria-selected:text-[#9AA0A6] dark:aria-selected:text-[#A0A0A0]"
        ),
        day_disabled: "text-[#9AA0A6] dark:text-[#A0A0A0] opacity-50",
        day_range_middle: cn(
          "aria-selected:bg-[#EAF3FF] aria-selected:text-[#297EFF]",
          "dark:aria-selected:bg-[#1A2B45] dark:aria-selected:text-[#4D8DFF]"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-[#9AA0A6] dark:text-[#A0A0A0]" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
