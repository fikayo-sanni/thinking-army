import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#F8F9FB] ",
        "relative overflow-hidden",
        "after:absolute after:inset-0",
        "after:translate-x-[-100%]",
        "after:animate-[shimmer_1.5s_infinite]",
        "after:bg-gradient-to-r",
        "after:from-transparent after:via-[#E4E6EB]/10 after:to-transparent",
        "dark:after:via-[#2A2A2A]/10",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
