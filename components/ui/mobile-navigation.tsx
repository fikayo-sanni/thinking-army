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
                "flex items-center justify-between w-full px-4 py-3 transition-colors",
                "hover:bg-[#F8F9FB] dark:hover:bg-[#1E1E1E]",
                active && "bg-[#EAF3FF] border-r-2 border-[#297EFF] dark:bg-[#1A2B45] dark:border-[#4D8DFF]",
                level > 0 && "pl-12"
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={cn(
                  "h-5 w-5",
                  active ? "text-[#297EFF] dark:text-[#4D8DFF]" : "text-[#9AA0A6] dark:text-[#A0A0A0]"
                )} />
                <span className={cn(
                  "font-medium text-sm",
                  active ? "text-[#297EFF] dark:text-[#4D8DFF]" : "text-[#202124] dark:text-[#E6E6E6]"
                )}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <Badge variant="outline" className="bg-[#EAF3FF] text-[#297EFF] border-[#297EFF] text-xs dark:bg-[#1A2B45] dark:text-[#4D8DFF] dark:border-[#4D8DFF]">
                    {item.badge}
                  </Badge>
                )}
                {hasChildren && (
                  <ChevronRight className={cn(
                    "h-4 w-4 text-[#9AA0A6] transition-transform dark:text-[#A0A0A0]",
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
              "flex items-center justify-between w-full px-4 py-3 h-auto font-normal hover:bg-[#F8F9FB] dark:hover:bg-[#1E1E1E]",
              level > 0 && "pl-12"
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5 text-[#9AA0A6] dark:text-[#A0A0A0]" />
              <span className="text-sm text-[#202124] dark:text-[#E6E6E6]">
                {item.label}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {item.badge && (
                <Badge variant="outline" className="bg-[#EAF3FF] text-[#297EFF] border-[#297EFF] text-xs dark:bg-[#1A2B45] dark:text-[#4D8DFF] dark:border-[#4D8DFF]">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronDown className={cn(
                  "h-4 w-4 text-[#9AA0A6] transition-transform dark:text-[#A0A0A0]",
                  isExpanded && "rotate-180"
                )} />
              )}
            </div>
          </Button>
        )}

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="bg-[#F8F9FB] border-l border-[#E4E6EB] ml-4 dark:bg-[#1E1E1E] dark:border-[#2A2A2A]">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={cn("bg-white border-[#E4E6EB] dark:bg-[#1E1E1E] dark:border-[#2A2A2A]", className)}>
      <CardContent className="p-0">
        <nav className="space-y-0.5">
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