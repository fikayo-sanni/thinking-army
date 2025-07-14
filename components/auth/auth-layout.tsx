import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AuthLogo } from "./auth-logo"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  maxWidth?: "sm" | "md" | "lg"
}

export function AuthLayout({ children, title, description, maxWidth = "md" }: AuthLayoutProps) {
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }

  return (
    <div className="min-h-screen dark:bg-[#0D0F1A] flex items-center justify-center p-4">
      <Card className={`w-full ${widthClasses[maxWidth]} dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border dark:border-[#2C2F3C] shadow-lg`}>
        <CardHeader className="text-center space-y-4">
          <AuthLogo />
          <div>
            <h2 className="text-xl text-white uppercase tracking-wide">{title}</h2>
            {description && <p className="text-[#A0AFC0] mt-2 text-sm">{description}</p>}
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
