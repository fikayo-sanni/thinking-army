"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#F8F9FB]  border border-[#E4E6EB] dark:border-[#2A2A2A]">
      <SliderPrimitive.Range className="absolute h-full bg-[#297EFF] dark:bg-[#4D8DFF]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-[#297EFF] dark:border-[#4D8DFF] bg-white  ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#297EFF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-[#1E1E1E] dark:focus-visible:ring-[#4D8DFF]" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
