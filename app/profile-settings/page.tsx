"use client"

import { useState } from "react"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, Camera, Save, Shield } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    timezone: "America/New_York",
    bio: "Passionate NFT collector and blockchain enthusiast. Building the future of digital assets.",
    joinDate: "2023-03-15",
    rank: "GOLD",
    totalEarnings: "45.7 USDC",
    referrals: 12,
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    // Show success message
    console.log("Profile updated:", profileData)
  }

  return (
    <ModernSidebar>
      <div className="min-h-screen">
        <ModernHeader />
        <div className="p-6 space-y-6">
          {/* Page Title Block */}
          <PageHeader title="PROFILE SETTINGS" description="Manage your personal information and account details" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview Card */}
            <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#00E5FF]" />
                  <span>PROFILE OVERVIEW</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-[#00E5FF]/20">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-[#00E5FF] to-[#6F00FF] text-white text-2xl font-bold">
                        {profileData.firstName[0]}
                        {profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-[#A0AFC0] text-sm">{profileData.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D0F1A] border border-[#2C2F3C]">
                    <span className="text-[#A0AFC0] text-sm">Current Rank</span>
                    <Badge className="bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30">{profileData.rank}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D0F1A] border border-[#2C2F3C]">
                    <span className="text-[#A0AFC0] text-sm">Total Earnings</span>
                    <span className="text-[#00E5FF] font-bold">{profileData.totalEarnings}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D0F1A] border border-[#2C2F3C]">
                    <span className="text-[#A0AFC0] text-sm">Referrals</span>
                    <span className="text-white font-bold">{profileData.referrals}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0D0F1A] border border-[#2C2F3C]">
                    <span className="text-[#A0AFC0] text-sm">Member Since</span>
                    <span className="text-white font-bold">{formatDate(profileData.joinDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
                <CardHeader>
                  <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                    <User className="h-5 w-5 text-[#00E5FF]" />
                    <span>PERSONAL INFORMATION</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                        FIRST NAME
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-[#0D0F1A] border-[#2C2F3C] text-white focus:border-[#00E5FF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                        LAST NAME
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-[#0D0F1A] border-[#2C2F3C] text-white focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                      EMAIL ADDRESS
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A0AFC0]" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-[#0D0F1A] border-[#2C2F3C] text-white focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                      PHONE NUMBER
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A0AFC0]" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10 bg-[#0D0F1A] border-[#2C2F3C] text-white focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                        COUNTRY
                      </Label>
                      <Select
                        value={profileData.country}
                        onValueChange={(value) => handleInputChange("country", value)}
                      >
                        <SelectTrigger className="bg-[#0D0F1A] border-[#2C2F3C] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
                          <SelectItem value="United States" className="text-white hover:bg-[#2C2F3C]">
                            United States
                          </SelectItem>
                          <SelectItem value="Canada" className="text-white hover:bg-[#2C2F3C]">
                            Canada
                          </SelectItem>
                          <SelectItem value="United Kingdom" className="text-white hover:bg-[#2C2F3C]">
                            United Kingdom
                          </SelectItem>
                          <SelectItem value="Germany" className="text-white hover:bg-[#2C2F3C]">
                            Germany
                          </SelectItem>
                          <SelectItem value="France" className="text-white hover:bg-[#2C2F3C]">
                            France
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                        TIMEZONE
                      </Label>
                      <Select
                        value={profileData.timezone}
                        onValueChange={(value) => handleInputChange("timezone", value)}
                      >
                        <SelectTrigger className="bg-[#0D0F1A] border-[#2C2F3C] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1E2D] border-[#2C2F3C]">
                          <SelectItem value="America/New_York" className="text-white hover:bg-[#2C2F3C]">
                            Eastern Time (ET)
                          </SelectItem>
                          <SelectItem value="America/Chicago" className="text-white hover:bg-[#2C2F3C]">
                            Central Time (CT)
                          </SelectItem>
                          <SelectItem value="America/Denver" className="text-white hover:bg-[#2C2F3C]">
                            Mountain Time (MT)
                          </SelectItem>
                          <SelectItem value="America/Los_Angeles" className="text-white hover:bg-[#2C2F3C]">
                            Pacific Time (PT)
                          </SelectItem>
                          <SelectItem value="Europe/London" className="text-white hover:bg-[#2C2F3C]">
                            GMT (London)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-[#A0AFC0] uppercase text-xs tracking-wider">
                      BIO
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="bg-[#0D0F1A] border-[#2C2F3C] text-white focus:border-[#00E5FF] min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-[#1A1E2D] border-[#2C2F3C]">
                <CardHeader>
                  <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-[#00E5FF]" />
                    <span>SECURITY SETTINGS</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#0D0F1A] border border-[#2C2F3C]">
                    <div>
                      <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                      <p className="text-[#A0AFC0] text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" className="border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10">
                      Enable 2FA
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[#0D0F1A] border border-[#2C2F3C]">
                    <div>
                      <h4 className="text-white font-medium">Change Password</h4>
                      <p className="text-[#A0AFC0] text-sm">Update your account password</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#2C2F3C] text-[#A0AFC0] hover:text-white hover:border-[#00E5FF]"
                    >
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 font-bold uppercase tracking-wide px-8"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "SAVING..." : "SAVE CHANGES"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernSidebar>
  )
}
