"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-[#E4E6EB] bg-white text-[#202124] dark:border-[#2A2A2A]  dark:text-[#E6E6E6]",
        info: "border-[#297EFF]/20 bg-[#297EFF]/5 text-[#297EFF] dark:border-[#4D8DFF]/20 dark:bg-[#4D8DFF]/5 dark:text-[#4D8DFF]",
        success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/5 text-amber-500 dark:border-amber-400/20 dark:bg-amber-400/5 dark:text-amber-400",
        destructive: "border-red-500/20 bg-red-500/5 text-red-500 dark:border-red-400/20 dark:bg-red-400/5 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-[#E4E6EB] bg-white px-3 text-sm font-medium text-[#202124] transition-colors hover:bg-[#F8F9FB] focus:outline-none focus:ring-2 focus:ring-[#297EFF]/10 disabled:pointer-events-none disabled:opacity-50 dark:border-[#2A2A2A]  dark:text-[#E6E6E6] dark:hover:bg-[#2A2A2A] dark:focus:ring-[#4D8DFF]/10",
      "group-[.destructive]:border-red-500/20 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500/5 group-[.destructive]:hover:text-red-500 group-[.destructive]:focus:ring-red-500/10 dark:group-[.destructive]:border-red-400/20 dark:group-[.destructive]:hover:border-red-400/30 dark:group-[.destructive]:hover:bg-red-400/5 dark:group-[.destructive]:hover:text-red-400 dark:group-[.destructive]:focus:ring-red-400/10",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-[#9AA0A6] opacity-0 transition-opacity hover:text-[#202124] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#297EFF]/10 group-hover:opacity-100 dark:text-[#A0A0A0] dark:hover:text-[#E6E6E6] dark:focus:ring-[#4D8DFF]/10",
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-500 group-[.destructive]:focus:ring-red-500/10 dark:group-[.destructive]:text-red-400 dark:group-[.destructive]:hover:text-red-300 dark:group-[.destructive]:focus:ring-red-400/10",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-medium", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
