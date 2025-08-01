import { ReactNode, FormHTMLAttributes } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface MobileFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function MobileForm({ 
  title, 
  description, 
  children, 
  className = "",
  ...props 
}: MobileFormProps) {
  return (
    <Card className={cn("dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB] mobile-card", className)}>
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && (
            <CardTitle className="text-white text-lg mobile-text-lg tracking-wide">
              {title}
            </CardTitle>
          )}
          {description && (
            <p className="text-[#A0AFC0] text-sm mobile-text-sm">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className="pt-0">
        <form className="space-y-4 mobile-form-spacing" {...props}>
          {children}
        </form>
      </CardContent>
    </Card>
  )
}

interface MobileFormFieldProps {
  label: string
  children: ReactNode
  required?: boolean
  error?: string
  className?: string
}

export function MobileFormField({ 
  label, 
  children, 
  required = false, 
  error, 
  className = "" 
}: MobileFormFieldProps) {
  return (
    <div className={cn("space-y-2 mobile-py-3", className)}>
      <Label className="text-white text-sm mobile-text-sm font-medium">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-red-400 text-xs mobile-text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function MobileInput({ error, className = "", ...props }: MobileInputProps) {
  return (
    <Input
      className={cn(
        "h-12 text-base mobile-text-lg dark:bg-[#1A1E2D]/50 dark:border-[#2C2F3C] text-white placeholder-[#A0AFC0] focus:border-[#0846A6] focus:ring-1 focus:ring-[#0846A6]",
        error && "border-red-400 focus:border-red-400 focus:ring-red-400",
        className
      )}
      {...props}
    />
  )
}

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function MobileTextarea({ error, className = "", ...props }: MobileTextareaProps) {
  return (
    <Textarea
      className={cn(
        "min-h-[120px] text-base mobile-text-lg dark:bg-[#1A1E2D]/50 dark:border-[#2C2F3C] text-white placeholder-[#A0AFC0] focus:border-[#0846A6] focus:ring-1 focus:ring-[#0846A6] resize-none",
        error && "border-red-400 focus:border-red-400 focus:ring-red-400",
        className
      )}
      {...props}
    />
  )
}

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  loading?: boolean
}

export function MobileButton({ 
  variant = "primary", 
  size = "md", 
  fullWidth = false,
  loading = false,
  children, 
  className = "", 
  disabled,
  ...props 
}: MobileButtonProps) {
  const sizeClasses = {
    sm: "h-10 px-4 text-sm mobile-text-sm",
    md: "h-12 px-6 text-base mobile-text-lg",
    lg: "h-14 px-8 text-lg mobile-text-lg"
  }

  const variantClasses = {
    primary: "bg-[#0846A6] hover:bg-[#0846A6]/90 text-white",
    secondary: "bg-[#2C2F3C] hover:bg-[#2C2F3C]/90 text-white",
    outline: "border-2 border-[#0846A6] text-[#0846A6] hover:bg-[#0846A6] hover:text-white"
  }

  return (
    <Button
      className={cn(
        "font-medium transition-all duration-200 touch-target",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full",
        loading && "opacity-70 cursor-not-allowed",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

interface MobileFormActionsProps {
  children: ReactNode
  className?: string
}

export function MobileFormActions({ children, className = "" }: MobileFormActionsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3 pt-4 mobile-py-3", className)}>
      {children}
    </div>
  )
} 