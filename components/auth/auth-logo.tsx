import { Coins } from "lucide-react"

export function AuthLogo() {
  return (
    <div className="flex items-center">
      <img
        src="/logo-dark-mode.svg"
        alt="GC Universe Logo"
        className="h-8 w-auto hidden dark:block"
      />
      <img
        src="/logo-light-mode.svg"
        alt="GC Universe Logo"
        className="h-8 w-auto dark:hidden"
      />
    </div>
  )
}
