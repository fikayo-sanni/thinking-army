import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-md border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-[#E4E6EB] bg-[#F8F9FB] text-[#202124] dark:border-[#2A2A2A] dark:bg-[#1E1E1E] dark:text-[#E6E6E6] [&>svg]:text-[#9AA0A6] dark:[&>svg]:text-[#A0A0A0]",
        info: "border-[#297EFF]/20 bg-[#297EFF]/5 text-[#297EFF] dark:border-[#4D8DFF]/20 dark:bg-[#4D8DFF]/5 dark:text-[#4D8DFF] [&>svg]:text-[#297EFF] dark:[&>svg]:text-[#4D8DFF]",
        success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:text-emerald-400 [&>svg]:text-emerald-500 dark:[&>svg]:text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/5 text-amber-500 dark:border-amber-400/20 dark:bg-amber-400/5 dark:text-amber-400 [&>svg]:text-amber-500 dark:[&>svg]:text-amber-400",
        destructive: "border-red-500/20 bg-red-500/5 text-red-500 dark:border-red-400/20 dark:bg-red-400/5 dark:text-red-400 [&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
