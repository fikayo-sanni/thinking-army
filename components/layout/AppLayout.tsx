'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Network, 
  Settings, 
  ChevronRight, 
  Menu, 
  X,
  BarChart2,
  GitBranch,
  FileText,
  Zap,
  UserCircle,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SubMenuItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type NavigationItem = {
  name: string;
  href?: string;
  icon: LucideIcon;
  badge: string | null;
  gradient: string;
  submenu?: SubMenuItem[];
};

const navigationItems: NavigationItem[] = [
  {
    name: 'AI Agents',
    href: '/agents',
    icon: Brain,
    badge: null,
    gradient: 'from-[#00B28C] to-[#00CC99]',
  },
  {
    name: 'My Network',
    href: '/network',
    icon: Users,
    badge: null,
    gradient: 'from-[#FFD700] to-[#FFA500]',
  },
  {
    name: 'Commissions',
    href: '/commissions',
    icon: TrendingUp,
    badge: null,
    gradient: 'from-[#6B7280] to-[#4B5563]',
  },
  {
    name: 'Workflows',
    href: '/workflows',
    icon: Network,
    badge: null,
    gradient: 'from-[#6F00FF] to-[#5500CC]',
  },
  {
    name: 'CRM',
    icon: UserCircle,
    badge: null,
    gradient: 'from-[#297EFF] to-[#4D8DFF]',
    submenu: [
      {
        name: 'Dashboard',
        href: '/crm',
        icon: BarChart2,
      },
      {
        name: 'Customers',
        href: '/crm/customers',
        icon: Users,
      },
      {
        name: 'Journeys',
        href: '/crm/journeys',
        icon: GitBranch,
      },
      {
        name: 'Templates',
        href: '/crm/templates',
        icon: FileText,
      },
      {
        name: 'Automation',
        href: '/crm/automation',
        icon: Zap,
      },
    ],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    badge: null,
    gradient: 'from-[#4ECDC4] to-[#26A69A]',
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);
  const pathname = usePathname();

  // Check if we're on the landing page
  const isLandingPage = pathname === '/';

  React.useEffect(() => {
    const stored = localStorage.getItem('sidebar:collapsed');
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      localStorage.setItem('sidebar:collapsed', String(!prev));
      return !prev;
    });
  };

  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleToggleSubmenu = (itemName: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  // If we're on the landing page, just render the children without the layout
  if (isLandingPage) {
    return <>{children}</>;
  }

  const renderNavItem = (item: NavigationItem | SubMenuItem, isSubmenuItem = false) => {
    const isActive = item.href 
      ? pathname === item.href || pathname.startsWith(item.href + '/')
      : 'submenu' in item && item.submenu?.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/'));
    const isExpanded = expandedItem === item.name;

    return (
      <div key={item.name}>
        <div
          className={cn(
            'group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            isSubmenuItem && 'pl-10'
          )}
          onClick={() => 'submenu' in item ? handleToggleSubmenu(item.name) : undefined}
          style={{ cursor: 'submenu' in item ? 'pointer' : 'default' }}
        >
          {item.href ? (
            <Link href={item.href} className="flex items-center gap-3 flex-1">
              <item.icon className="h-4 w-4" />
              {!isCollapsed && (
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              )}
            </Link>
          ) : (
            <>
              <item.icon className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium flex-1">
                    {item.name}
                  </span>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </>
              )}
            </>
          )}
        </div>
        {'submenu' in item && item.submenu && !isCollapsed && isExpanded && (
          <div className="mt-1">
            {item.submenu.map((subItem) => renderNavItem(subItem, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen border-r bg-background transition-all duration-300',
          isCollapsed ? 'w-14' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-3">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">T</span>
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-lg font-semibold">
                Thinking Army
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3">
          {navigationItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Collapse Button */}
        <button
          className="absolute bottom-4 left-3 right-3 flex items-center justify-center rounded-lg border bg-background p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={handleToggleCollapse}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform',
              isCollapsed ? 'rotate-0' : 'rotate-180'
            )}
          />
          {!isCollapsed && (
            <span className="ml-2 text-sm">Collapse</span>
          )}
        </button>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <aside
            className="fixed left-0 top-0 h-screen w-64 border-r bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 items-center border-b px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">
                  T
                </span>
              </div>
              <span className="ml-3 text-lg font-semibold">
                Thinking Army
              </span>
            </div>

            <nav className="flex flex-col gap-1 p-3">
              {navigationItems.map((item) => renderNavItem(item))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          isCollapsed ? 'lg:pl-14' : 'lg:pl-60'
        )}
      >
        {children}
      </main>
    </div>
  );
} 