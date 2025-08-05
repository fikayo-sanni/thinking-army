"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Users, CheckCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { referralService } from "@/lib/services/referral-service"

interface ReferrerInfo {
  id: string
  username: string
  name: string
}

export default function InvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const code = searchParams.get('code')

  useEffect(() => {
    if (code) {
      validateReferralCode()
    } else {
      setError("No referral code provided in the URL.")
      setLoading(false)
    }
  }, [code])

  const validateReferralCode = async () => {
    if (!code) return
    
    try {
      setLoading(true)
      const result = await referralService.validateReferralCode(code)
      setReferrerInfo(result.referrer)
    } catch (err) {
      setError("Invalid or expired invite link. Please check the link and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !code) {
      setError("Username is required")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // For now, we'll generate a temporary youre_id
      // In production, this would integrate with the actual youre_id registration flow
      const tempYoureId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await referralService.registerWithReferral({
        youreId: tempYoureId,
        referralCode: code,
        username: username.trim(),
        email: email.trim() || undefined,
        name: name.trim() || undefined,
      })

      setSuccess(true)
      
      // In production, redirect to youre_id registration with pre-filled data
      // For now, show success message and redirect to youre_id
      setTimeout(() => {
        // This would be the actual youre_id registration URL with query params
        window.location.href = `${process.env.NEXT_PUBLIC_YOUREID_REGISTRATION_URL || 'https://youre.id/register'}?sponsor=${referrerInfo?.username}&prefill_username=${username}&prefill_email=${email}&prefill_name=${name}`
      }, 3000)

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process registration. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0846A6]"></div>
            <p className="mt-4 text-[#A0AFC0]">Validating invite link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !referrerInfo) {
    return (
      <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Invalid Invite Link</h2>
            <p className="text-center text-[#A0AFC0] mb-6">{error}</p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-[#0846A6] text-white hover:bg-[#06377a]"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 border-green-400 bg-green-50 dark:bg-[#2C2F3C] dark:border-green-800">
          <CardContent className="flex flex-col items-center py-10">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Registration Initiated!</h2>
            <p className="text-center text-[#A0AFC0] mb-6">
              You'll be redirected to complete your youre.id registration. After completing registration, you'll be added to {referrerInfo?.name || referrerInfo?.username}'s network.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#A0AFC0]">
              <ExternalLink className="h-4 w-4" />
              Redirecting to youre.id...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A] flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 dark:bg-[#1A1E2D] border-[#E5E7EB] dark:border-[#E5E7EB]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-[#0846A6]/10">
              <Users className="h-8 w-8 text-[#0846A6]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Join {referrerInfo?.name || referrerInfo?.username}'s Network
          </CardTitle>
          <p className="text-[#A0AFC0] mt-2">
            You've been invited to join the Gamescoin network. Enter your details below to get started.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700 dark:text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-[#0846A6]/5 dark:bg-[#0846A6]/10 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#0846A6]/10">
                <Users className="h-5 w-5 text-[#0846A6]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Your Sponsor</h3>
                <p className="text-sm text-[#A0AFC0]">{referrerInfo?.name || referrerInfo?.username}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                Username *
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Full Name (optional)
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            <Button 
              type="submit" 
              disabled={submitting || !username.trim()}
              className="w-full bg-[#0846A6] hover:bg-[#06377a] text-white"
            >
              {submitting ? "Processing..." : "Continue to youre.id Registration"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#A0AFC0]">
              By continuing, you'll be redirected to youre.id to complete your registration.
              After successful registration, you'll automatically be added to your sponsor's network.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 