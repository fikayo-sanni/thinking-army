import type React from "react"

interface FilterControlsProps {
  children: React.ReactNode
}

export function FilterControls({ children }: FilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {children}
    </div>
  )
}
