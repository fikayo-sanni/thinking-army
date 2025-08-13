"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-[#E4E6EB] bg-white ring-offset-white transition-colors hover:border-[#297EFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#297EFF]/10 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[#297EFF] data-[state=checked]:text-[#297EFF] dark:border-[#2A2A2A] dark:bg-[#1E1E1E] dark:ring-offset-[#1E1E1E] dark:hover:border-[#4D8DFF] dark:focus-visible:ring-[#4D8DFF]/10 dark:data-[state=checked]:border-[#4D8DFF] dark:data-[state=checked]:text-[#4D8DFF]",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2 w-2 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
