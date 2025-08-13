"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#297EFF]/10 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-[#1E1E1E] dark:focus-visible:ring-[#4D8DFF]/10 [&_svg]:pointer-events-none [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-[#F8F9FB] hover:text-[#297EFF] dark:hover:bg-[#1E1E1E] dark:hover:text-[#4D8DFF] data-[state=on]:bg-[#EAF3FF] data-[state=on]:text-[#297EFF] dark:data-[state=on]:bg-[#1A2B45] dark:data-[state=on]:text-[#4D8DFF]",
        outline: "border border-[#E4E6EB] dark:border-[#2A2A2A] bg-transparent hover:bg-[#F8F9FB] hover:text-[#297EFF] dark:hover:bg-[#1E1E1E] dark:hover:text-[#4D8DFF] data-[state=on]:bg-[#EAF3FF] data-[state=on]:text-[#297EFF] dark:data-[state=on]:bg-[#1A2B45] dark:data-[state=on]:text-[#4D8DFF]",
      },
      size: {
        default: "h-9 px-3 min-w-[2.25rem]",
        sm: "h-8 px-2.5 min-w-[2rem]",
        lg: "h-10 px-5 min-w-[2.5rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
