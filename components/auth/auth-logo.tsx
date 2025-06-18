import { Coins } from "lucide-react"

export function AuthLogo() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="h-12 w-12 rounded-lg bg-[#00E5FF] flex items-center justify-center">
        <img src="/GCs.svg" alt="Gamescoin Logo" className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">GAMESCOIN</h1>
      </div>
    </div>
  )
}
