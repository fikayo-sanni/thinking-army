"use client"

/**
 * @deprecated Use ModernSidebar instead. This component will be removed in a future release.
 * The ModernSidebar component provides the same functionality with updated styling
 * that matches the new Attio-inspired design system.
 * 
 * Migration:
 * 1. Import ModernSidebar:
 *    import { ModernSidebar } from "@/components/layout/modern-sidebar"
 * 
 * 2. Replace AppSidebar with ModernSidebar:
 *    <AppSidebar /> -> <ModernSidebar>{children}</ModernSidebar>
 */

import { ModernSidebar } from "@/components/layout/modern-sidebar"

export function AppSidebar() {
  console.warn(
    "AppSidebar is deprecated. Please use ModernSidebar instead. " +
    "This component will be removed in a future release."
  )

  return (
    <ModernSidebar>
      {/* @ts-expect-error - ModernSidebar expects children but AppSidebar doesn't provide them */}
      {null}
    </ModernSidebar>
  )
} 