import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AuthLogo } from "./auth-logo"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  maxWidth?: "sm" | "md" | "lg"
  footer?: React.ReactNode
}

export function AuthLayout({ children, title, description, maxWidth = "md", footer }: AuthLayoutProps) {
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }

  return (
    <div className="min-h-screen bg-white  flex flex-col">
      {/* Header with Logo */}
      <header className="w-full py-6 px-8 border-b border-[#E4E6EB] dark:border-[#2A2A2A]">
        <AuthLogo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className={`w-full ${widthClasses[maxWidth]} space-y-8`}>
          {/* Title Section */}
          <div className="text-center space-y-2">
            <h1 className="text-[28px] font-semibold text-[#202124] dark:text-[#E6E6E6]">
              {title}
            </h1>
            {description && (
              <p className="text-[#5F6368] dark:text-[#A0A0A0] text-base">
                {description}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      {footer && (
        <footer className="w-full py-6 px-8 border-t border-[#E4E6EB] dark:border-[#2A2A2A] text-center text-[#5F6368] dark:text-[#A0A0A0] text-sm">
          {footer}
        </footer>
      )}
    </div>
  )
}
