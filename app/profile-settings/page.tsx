"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { formatDate, formatThousands } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: profile,
    isLoading: profileLoading,
    error,
    refetch,
  } = useProfile();
  const { logout } = useAuth();
  const router = useRouter();

  // Map API profile fields to UI fields
  const profileData = profile
    ? {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email,
        bio: "", // Not in API, leave blank or fetch from another source
        joinDate: profile.joinDate,
        rank: profile.rank,
        totalEarnings: profile.totalEarnings, // Not in API, leave blank or fetch from another source
        referrals: profile.totalReferrals,
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        joinDate: "",
        rank: "",
        totalEarnings: "",
        referrals: 0,
      };

  const handleInputChange = (field: string, value: string) => {
    // You may want to implement profile update logic here
    // For now, do nothing or show a message
  };

  const handleSave = async () => {
    setIsLoading(true);
    // TODO: Implement real API call to update profile
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Show success message
    console.log("Profile updated:", profileData);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen">
        <div className="p-6 space-y-6">
          <PageHeader
            title="PROFILE SETTINGS"
            description="Manage your personal information and account details"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview Card Skeleton */}
            <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-32 mx-auto" />
                    <Skeleton className="h-4 w-40 mx-auto" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex justify-end mt-8">
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
            {/* Personal Information Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
                <CardHeader>
                  <Skeleton className="h-6 w-56 mb-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
              {/* Security Settings Skeleton */}
              <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
                <CardHeader>
                  <Skeleton className="h-6 w-56 mb-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full border-red-400 bg-red-50 dark:bg-[#2C2F3C] dark:border-red-800 shadow-lg">
          <CardContent className="flex flex-col items-center py-10">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
              Profile Load Failed
            </h2>
            <p className="text-center text-[#A0AFC0] mb-6">
              We couldn't load your profile right now. Please check your
              connection or try again in a moment.
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-[#0846A6] text-white hover:bg-[#06377a]"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        {/* Page Title Block */}
        <PageHeader
          title="PROFILE SETTINGS"
          description="Manage your personal information and account details"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
            <CardHeader>
              <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                <User className="h-5 w-5 text-[#0846A6] dark:text-[#0846A6]" />
                <span>PROFILE OVERVIEW</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-[#0846A6]/20">
                    <AvatarImage
                      src="/placeholder.svg?height=96&width=96"
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#0846A6] dark:from-[#0846A6] to-[#6F00FF] text-white text-2xl font-bold">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#0846A6] text-[#FFFFFF] dark:bg-[#0846A6] dark:hover:bg-[#0846A6]/90 dark:text-black p-0"
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
                <div className="flex items-center justify-between p-3 border rounded-lg dark:bg-[#0D0F1A] border-[#E5E7EB] dark:border-[#2C2F3C]">
                  <span className="text-[#A0AFC0] text-sm">Current Rank</span>
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30">
                    {profileData.rank.split(" ")[0]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg dark:bg-[#0D0F1A] border-[#E5E7EB] dark:border-[#2C2F3C]">
                  <span className="text-[#A0AFC0] text-sm">AllTime VP</span>
                  <span className="dark:text-[#0846A6] text-[#0846A6] font-bold">
                    {formatThousands(profileData.totalEarnings.toFixed(2))} VP
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg dark:bg-[#0D0F1A] border-[#E5E7EB] dark:border-[#2C2F3C]">
                  <span className="text-[#A0AFC0] text-sm">Member Since</span>
                  <span className="text-white font-bold">
                    {formatDate(profileData.joinDate)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#2C2F3C]">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wide flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#0846A6] dark:text-[#0846A6]" />
                  <span>PERSONAL INFORMATION</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-[#A0AFC0] uppercase text-xs tracking-wider"
                    >
                      FIRST NAME
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="dark:bg-[#0D0F1A] dark:border-[#2C2F3C] text-white focus:border-[#0846A6]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-[#A0AFC0] uppercase text-xs tracking-wider"
                    >
                      LAST NAME
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="dark:bg-[#0D0F1A] dark:border-[#2C2F3C] text-white focus:border-[#0846A6]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[#A0AFC0] uppercase text-xs tracking-wider"
                  >
                    EMAIL ADDRESS
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A0AFC0]" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 dark:bg-[#0D0F1A] dark:border-[#2C2F3C] text-white focus:border-[#0846A6]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-[#A0AFC0] uppercase text-xs tracking-wider"
                  >
                    BIO
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="dark:bg-[#0D0F1A] dark:border-[#2C2F3C] text-white focus:border-[#0846A6] min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end mt-8">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-red-500 border-red-500 hover:bg-red-500/10"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Add logout button at the bottom */}
      </div>
    </div>
  );
}
