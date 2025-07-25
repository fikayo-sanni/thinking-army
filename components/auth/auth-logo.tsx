import { Coins } from "lucide-react"

export function AuthLogo() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="h-12 w-12 rounded-lg flex items-center justify-center">
        <img
          src="/logo-dark-mode.svg"
          alt="GC Universe Logo"
          className="h-20 w-20 hidden dark:block"
        />
        {/* Light Mode Logo */}
        <img
          src="/logo-light-mode.svg"
          alt="GC Universe Logo"
          className="h-20 w-20 dark:hidden"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">GC UNIVERSE</h1>
      </div>
    </div>
  )
}
