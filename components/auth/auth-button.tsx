"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface AuthButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "primary" | "secondary"
}

export function AuthButton({
  children,
  isLoading = false,
  loadingText,
  disabled = false,
  onClick,
  type = "button",
  variant = "primary",
}: AuthButtonProps) {
  const baseClasses = "w-full h-12 uppercase tracking-wide font-bold"
  const variantClasses = {
    primary: "bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90",
    secondary: "bg-[#1A1E2D] text-white border border-[#2C2F3C] hover:bg-[#2C2F3C]",
  }

  return (
    <Button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {isLoading ? loadingText || "LOADING..." : children}
    </Button>
  )
}
