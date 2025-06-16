import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  label: string
  current: number
  target: number
  unit?: string
  color?: string
}

export function ProgressBar({ label, current, target, unit = "", color = "bg-[#00E5FF]" }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const isComplete = current >= target

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[#A0AFC0] text-sm uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-medium ${isComplete ? "text-green-400" : "text-white"}`}>
          {current.toLocaleString()} / {target.toLocaleString()} {unit}
        </span>
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-3 bg-[#2C2F3C]" />
        <div
          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${
            isComplete ? "bg-green-500" : color
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-[#A0AFC0]">
        {percentage.toFixed(1)}% Complete
        {isComplete && " ✓"}
      </div>
    </div>
  )
}
