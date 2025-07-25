"use client"

import React from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { useAuth } from "@/lib/auth/AuthProvider"

export default function LoginPage() {
  const { login } = useAuth();

  console.log('test v2')

  return (
    <AuthLayout title="SIGN IN" description="Sign in with your YOURE.ID account to access your dashboard">
      <div className="flex flex-col items-center justify-center min-h-[200px] ">
        <button
          onClick={login}
          className="px-6 py-3 bg-blue-600 text-white dark:text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Login with YOURE.ID
        </button>
      </div>
    </AuthLayout>
  )
}
