import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface AuthLinkProps {
  href: string
  children: React.ReactNode
  showBackIcon?: boolean
}

export function AuthLink({ href, children, showBackIcon = false }: AuthLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center space-x-2 text-[#0846A6] hover:text-[#0846A6]/80 text-sm transition-colors"
    >
      {showBackIcon && <ArrowLeft className="h-4 w-4" />}
      <span>{children}</span>
    </Link>
  )
}
