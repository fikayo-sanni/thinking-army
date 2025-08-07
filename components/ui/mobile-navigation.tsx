import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  ChevronRight, 
  Home, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Settings,
  LucideIcon 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavItem {
  id: string
  label: string
  href?: string
  icon: LucideIcon
  badge?: string | number
  children?: MobileNavItem[]
}

interface MobileNavigationProps {
  items: MobileNavItem[]
  className?: string
}

export function MobileNavigation({ items, className = "" }: MobileNavigationProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const pathname = usePathname()

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderNavItem = (item: MobileNavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const active = isActive(item.href)

    return (
      <div key={item.id} className="w-full">
        {item.href ? (
          <Link href={item.href} className="block w-full">
            <div
              className={cn(
                "flex items-center justify-between w-full mobile-nav-item touch-target transition-colors",
                "hover:bg-[#2C2F3C]/50 dark:hover:bg-[#2C2F3C]/50",
                active && "bg-[#0846A6]/10 border-r-4 border-[#0846A6]",
                level > 0 && "pl-12"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={cn(
                  "h-5 w-5",
                  active ? "text-[#0846A6]" : "text-[#A0AFC0]"
                )} />
                <span className={cn(
                  "font-medium mobile-text-sm",
                  active ? "text-[#0846A6]" : "text-white"
                )}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <Badge className="bg-[#0846A6] text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
                {hasChildren && (
                  <ChevronRight className={cn(
                    "h-4 w-4 text-[#A0AFC0] transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                )}
              </div>
            </div>
          </Link>
        ) : (
          <Button
            variant="ghost"
            onClick={() => hasChildren && toggleExpanded(item.id)}
            className={cn(
              "flex items-center justify-between w-full mobile-nav-item touch-target hover:bg-[#2C2F3C]/50",
              level > 0 && "pl-12"
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5 text-[#A0AFC0]" />
              <span className="font-medium text-white mobile-text-sm">
                {item.label}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {item.badge && (
                <Badge className="bg-[#0846A6] text-white text-xs">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronDown className={cn(
                  "h-4 w-4 text-[#A0AFC0] transition-transform",
                  isExpanded && "rotate-180"
                )} />
              )}
            </div>
          </Button>
        )}

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="bg-[#1A1E2D]/30 border-l-2 border-[#E5E7EB] ml-4">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={cn("dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card", className)}>
      <CardContent className="p-0">
        <nav className="space-y-1">
          {items.map(item => renderNavItem(item))}
        </nav>
      </CardContent>
    </Card>
  )
}

// Default navigation items for the app
export const defaultMobileNavItems: MobileNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    id: "commissions",
    label: "Commissions",
    href: "/commissions",
    icon: TrendingUp
  },
  {
    id: "network",
    label: "Network",
    href: "/network",
    icon: Users
  },
  {
    id: "payouts",
    label: "Payouts",
    href: "/payouts",
    icon: CreditCard
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      {
        id: "profile",
        label: "Profile Settings",
        href: "/profile-settings",
        icon: Settings
      },
      {
        id: "wallet",
        label: "Wallet Settings", 
        href: "/wallet-settings",
        icon: CreditCard
      },

    ]
  }
] 