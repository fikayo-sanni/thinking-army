import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#297EFF] text-white hover:bg-[#1D6FEF] active:bg-[#1565E5] dark:bg-[#4D8DFF] dark:hover:bg-[#3D7DF0] dark:active:bg-[#2D6DE1]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800",
        outline:
          "border border-[#E4E6EB] bg-white text-[#202124] hover:border-[#297EFF] hover:text-[#297EFF] dark:border-[#2A2A2A] dark:bg-[#1E1E1E] dark:text-[#E6E6E6] dark:hover:border-[#4D8DFF] dark:hover:text-[#4D8DFF]",
        secondary:
          "bg-[#F8F9FB] text-[#202124] hover:bg-[#EEF1F5] active:bg-[#E4E6EB] dark:bg-[#1E1E1E] dark:text-[#E6E6E6] dark:hover:bg-[#2A2A2A] dark:active:bg-[#363636]",
        ghost: "text-[#202124] hover:bg-[#F8F9FB] active:bg-[#EEF1F5] dark:text-[#E6E6E6] dark:hover:bg-[#1E1E1E] dark:active:bg-[#2A2A2A]",
        link: "text-[#297EFF] underline-offset-4 hover:underline dark:text-[#4D8DFF]",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
