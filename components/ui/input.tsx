import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-[#E4E6EB] bg-white px-3 py-2 text-[#202124] placeholder:text-[#9AA0A6] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-[#297EFF] focus:border-[#297EFF] focus:outline-none focus:ring-2 focus:ring-[#297EFF]/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2A2A2A] dark:bg-[#1E1E1E] dark:text-[#E6E6E6] dark:placeholder:text-[#A0A0A0] dark:hover:border-[#4D8DFF] dark:focus:border-[#4D8DFF] dark:focus:ring-[#4D8DFF]/10 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
