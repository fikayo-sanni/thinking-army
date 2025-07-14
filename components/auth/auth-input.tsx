"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface AuthInputProps {
  id: string
  label: string
  type?: "text" | "email" | "password"
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  showPasswordToggle?: boolean
}

export function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  showPasswordToggle = false,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#A0AFC0] uppercase text-xs tracking-wider">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-[#0D0F1A] border-[#2C2F3C] text-white placeholder-[#A0AFC0] focus:border-[#0846A6] h-12 pr-12"
          required={required}
        />
        {showPasswordToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-[#A0AFC0] hover:text-white hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}
