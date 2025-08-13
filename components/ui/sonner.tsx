"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#202124] group-[.toaster]:border-[#E4E6EB] group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-[#1E1E1E] dark:group-[.toaster]:text-[#E6E6E6] dark:group-[.toaster]:border-[#2A2A2A]",
          description: "group-[.toast]:text-[#9AA0A6] dark:group-[.toast]:text-[#A0A0A0]",
          actionButton:
            "group-[.toast]:bg-[#297EFF] group-[.toast]:text-white group-[.toast]:hover:bg-[#1D6FEF] dark:group-[.toast]:bg-[#4D8DFF] dark:group-[.toast]:hover:bg-[#3D7DF0]",
          cancelButton:
            "group-[.toast]:bg-white group-[.toast]:text-[#202124] group-[.toast]:border-[#E4E6EB] group-[.toast]:hover:border-[#297EFF] group-[.toast]:hover:text-[#297EFF] dark:group-[.toast]:bg-[#1E1E1E] dark:group-[.toast]:text-[#E6E6E6] dark:group-[.toast]:border-[#2A2A2A] dark:group-[.toast]:hover:border-[#4D8DFF] dark:group-[.toast]:hover:text-[#4D8DFF]",
          success:
            "group-[.toast]:border-emerald-500/20 group-[.toast]:bg-emerald-500/5 group-[.toast]:text-emerald-500 dark:group-[.toast]:border-emerald-400/20 dark:group-[.toast]:bg-emerald-400/5 dark:group-[.toast]:text-emerald-400",
          error:
            "group-[.toast]:border-red-500/20 group-[.toast]:bg-red-500/5 group-[.toast]:text-red-500 dark:group-[.toast]:border-red-400/20 dark:group-[.toast]:bg-red-400/5 dark:group-[.toast]:text-red-400",
          info:
            "group-[.toast]:border-[#297EFF]/20 group-[.toast]:bg-[#297EFF]/5 group-[.toast]:text-[#297EFF] dark:group-[.toast]:border-[#4D8DFF]/20 dark:group-[.toast]:bg-[#4D8DFF]/5 dark:group-[.toast]:text-[#4D8DFF]",
          warning:
            "group-[.toast]:border-amber-500/20 group-[.toast]:bg-amber-500/5 group-[.toast]:text-amber-500 dark:group-[.toast]:border-amber-400/20 dark:group-[.toast]:bg-amber-400/5 dark:group-[.toast]:text-amber-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
