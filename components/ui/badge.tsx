import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-[#297EFF]/20 bg-[#297EFF]/10 text-[#297EFF] dark:border-[#4D8DFF]/20 dark:bg-[#4D8DFF]/10 dark:text-[#4D8DFF]",
        secondary:
          "border-[#E4E6EB] bg-[#F8F9FB] text-[#202124] dark:border-[#2A2A2A] dark:bg-[#1E1E1E] dark:text-[#E6E6E6]",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400",
        destructive:
          "border-red-500/20 bg-red-500/10 text-red-500 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-500 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
        info:
          "border-blue-500/20 bg-blue-500/10 text-blue-500 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-400",
        outline: 
          "border-[#E4E6EB] text-[#202124] dark:border-[#2A2A2A] dark:text-[#E6E6E6]",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "px-1.5 py-0.25 text-xs",
        lg: "px-2.5 py-0.75 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
