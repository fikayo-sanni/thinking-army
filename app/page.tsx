"use client"

import type React from "react"

import { useState } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthButton } from "@/components/auth/auth-button"
import { AuthLink } from "@/components/auth/auth-link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Handle login logic here
    console.log("Login attempt:", { email, password })
    setIsLoading(false)
  }

  return (
    <AuthLayout title="SIGN IN" description="Enter your credentials to access your dashboard">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Fields Block */}
        <div className="space-y-4">
          <AuthInput
            id="email"
            label="EMAIL ADDRESS"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            required
          />

          <AuthInput
            id="password"
            label="PASSWORD"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
            showPasswordToggle
          />
        </div>

        {/* Action Button Block */}
        <AuthButton type="submit" isLoading={isLoading} loadingText="SIGNING IN...">
          SIGN IN
        </AuthButton>

        {/* Auxiliary Links Block */}
        <div className="space-y-4 text-center">
          <AuthLink href="/forgot-password">Forgot password?</AuthLink>

          <div className="text-sm text-[#A0AFC0]">
            Don't have an account? <AuthLink href="/signup">Sign up</AuthLink>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}
