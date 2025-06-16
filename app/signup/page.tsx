"use client"

import type React from "react"

import { useState } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthButton } from "@/components/auth/auth-button"
import { AuthLink } from "@/components/auth/auth-link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Handle signup logic here
    console.log("Signup attempt:", formData)
    setIsLoading(false)
  }

  return (
    <AuthLayout title="SIGN UP" description="Create your account to start tracking NFT sales">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Fields Block */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <AuthInput
              id="firstName"
              label="FIRST NAME"
              value={formData.firstName}
              onChange={(value) => handleInputChange("firstName", value)}
              placeholder="First name"
              required
            />
            <AuthInput
              id="lastName"
              label="LAST NAME"
              value={formData.lastName}
              onChange={(value) => handleInputChange("lastName", value)}
              placeholder="Last name"
              required
            />
          </div>

          <AuthInput
            id="email"
            label="EMAIL ADDRESS"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            placeholder="Enter your email"
            required
          />

          <AuthInput
            id="password"
            label="PASSWORD"
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            placeholder="Create a password"
            required
            showPasswordToggle
          />

          <AuthInput
            id="confirmPassword"
            label="CONFIRM PASSWORD"
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange("confirmPassword", value)}
            placeholder="Confirm your password"
            required
            showPasswordToggle
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              className="border-[#2C2F3C] data-[state=checked]:bg-[#00E5FF] data-[state=checked]:border-[#00E5FF]"
            />
            <Label htmlFor="terms" className="text-sm text-[#A0AFC0] leading-relaxed">
              I agree to the <AuthLink href="/terms">Terms of Service</AuthLink> and{" "}
              <AuthLink href="/privacy">Privacy Policy</AuthLink>
            </Label>
          </div>
        </div>

        {/* Action Button Block */}
        <AuthButton
          type="submit"
          isLoading={isLoading}
          loadingText="CREATING ACCOUNT..."
          disabled={!formData.agreeToTerms}
        >
          SIGN UP
        </AuthButton>

        {/* Auxiliary Links Block */}
        <div className="text-center">
          <div className="text-sm text-[#A0AFC0]">
            Already have an account? <AuthLink href="/login">Sign in</AuthLink>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}
