"use client"

import type React from "react"

import { useState } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthButton } from "@/components/auth/auth-button"
import { AuthLink } from "@/components/auth/auth-link"
import { SuccessState } from "@/components/auth/success-state"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Handle password reset logic here
    console.log("Password reset request for:", email)
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <SuccessState
        title="EMAIL SENT"
        message={`We've sent password reset instructions to ${email}. Please check your email and follow the instructions to reset your password.`}
        email={email}
        backLink={{
          href: "/login",
          text: "Back to sign in",
        }}
      />
    )
  }

  return (
    <AuthLayout title="FORGOT PASSWORD">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Instructional Text Block */}
        <div className="text-center">
          <p className="text-[#A0AFC0] leading-relaxed">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Input Field Block */}
        <AuthInput
          id="email"
          label="EMAIL ADDRESS"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
          required
        />

        {/* Action Button Block */}
        <AuthButton type="submit" isLoading={isLoading} loadingText="SENDING...">
          RESET PASSWORD
        </AuthButton>

        {/* Auxiliary Link Block */}
        <div className="text-center">
          <AuthLink href="/login" showBackIcon>
            Back to sign in
          </AuthLink>
        </div>
      </form>
    </AuthLayout>
  )
}
