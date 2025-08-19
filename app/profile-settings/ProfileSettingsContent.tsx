'use client';

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
import { formatThousands } from "@/lib/utils";
import { useProfile } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

// Add card styles
const cardStyles = {
  base: "bg-white  border border-[#E4E6EB] dark:border-[#2A2A2A] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:border-[#DADCE0] dark:hover:border-[#3A3A3A] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
  header: "flex items-center justify-between p-4 border-b border-[#E4E6EB] dark:border-[#2A2A2A]",
  headerLeft: "flex items-center space-x-3",
  iconContainer: "flex items-center justify-center w-8 h-8 rounded-lg bg-[#297EFF]/10 dark:bg-[#4D8DFF]/10",
  icon: "w-5 h-5 text-[#297EFF] dark:text-[#4D8DFF]",
  title: "text-[15px] font-medium text-[#202124] dark:text-[#E6E6E6]",
  subtitle: "text-[12px] text-[#5F6368] dark:text-[#A0A0A0] mt-0.5",
  content: "p-4",
  metric: {
    container: "flex items-center justify-between p-3 rounded-md bg-[#F8F9FB] dark:bg-[#1A2B45] transition-colors duration-150",
    label: "text-[14px] text-[#5F6368] dark:text-[#A0A0A0]",
    value: "text-[20px] font-semibold text-[#202124] dark:text-[#E6E6E6]",
  },
};

// Safe format date function
function formatDate(date: string | undefined): string {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

export function ProfileSettingsContent() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: profile,
    isLoading: profileLoading,
    error,
    refetch,
  } = useProfile();

  // Map API profile fields to UI fields
  const profileData = profile
    ? {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email,
        bio: "", // Not in API, leave blank or fetch from another source
        joinDate: profile.joinDate,
        rank: profile.rank || "No Rank",
        totalEarnings: profile.totalEarnings, // Not in API, leave blank or fetch from another source
        referrals: profile.totalReferrals,
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        joinDate: "",
        rank: "No Rank",
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Show success message
    console.log("Profile updated:", profileData);
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
            <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
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
              <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
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
              <Card className="border-[#E5E7EB] dark:bg-[#1A1E2D] dark:border-[#E5E7EB]">
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
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-semibold text-[#202124] dark:text-[#E6E6E6]">
            Profile Settings
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <div className={cardStyles.base}>
          <div className={cardStyles.header}>
            <div className={cardStyles.headerLeft}>
              <div className={cardStyles.iconContainer}>
                <User className={cardStyles.icon} />
              </div>
              <div>
                <h3 className={cardStyles.title}>Profile Overview</h3>
                <p className={cardStyles.subtitle}>Your account information</p>
              </div>
            </div>
          </div>
          <div className={cardStyles.content}>
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-[#297EFF]/10 dark:ring-[#4D8DFF]/10">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                  <AvatarFallback className="bg-[#F8F9FB] dark:bg-[#1A2B45] text-[#297EFF] text-2xl font-medium">
                    {profileData.firstName[0]}
                    {profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {/*<button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#297EFF] hover:bg-[#1D6FFF] text-white flex items-center justify-center transition-colors">
                  <Camera className="h-4 w-4" />
                </button>*/}
              </div>
              <div className="text-center">
                <h3 className="text-[#202124] dark:text-[#E6E6E6] font-medium text-lg">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-[#5F6368] dark:text-[#A0A0A0] text-sm">{profileData.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className={cardStyles.metric.container}>
                <span className={cardStyles.metric.label}>Current Rank</span>
                <Badge className="bg-[#297EFF]/10 text-[#297EFF] border-[#297EFF]/30">
                  {profileData.rank}
                </Badge>
              </div>
              <div className={cardStyles.metric.container}>
                <span className={cardStyles.metric.label}>AllTime VP</span>
                <span className={cardStyles.metric.value}>
                  {formatThousands(typeof profileData.totalEarnings === 'number' ? profileData.totalEarnings.toFixed(0) : '0')} VP
                </span>
              </div>
              <div className={cardStyles.metric.container}>
                <span className={cardStyles.metric.label}>Member Since</span>
                <span className={cardStyles.metric.value}>
                  {formatDate(profileData.joinDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className={cardStyles.base}>
            <div className={cardStyles.header}>
              <div className={cardStyles.headerLeft}>
                <div className={cardStyles.iconContainer}>
                  <User className={cardStyles.icon} />
                </div>
                <div>
                  <h3 className={cardStyles.title}>Personal Information</h3>
                  <p className={cardStyles.subtitle}>Manage your personal details</p>
                </div>
              </div>
            </div>
            <div className={cardStyles.content}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[#5F6368] dark:text-[#A0A0A0] text-sm">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-9 bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] focus:border-[#297EFF] focus:ring-[#297EFF]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[#5F6368] dark:text-[#A0A0A0] text-sm">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-9 bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] focus:border-[#297EFF] focus:ring-[#297EFF]/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#5F6368] dark:text-[#A0A0A0] text-sm">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5F6368] dark:text-[#A0A0A0]" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-9 pl-10 bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] focus:border-[#297EFF] focus:ring-[#297EFF]/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-[#5F6368] dark:text-[#A0A0A0] text-sm">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px] bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] focus:border-[#297EFF] focus:ring-[#297EFF]/10"
                  />
                </div>

                {/*<div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="h-9 bg-[#297EFF] hover:bg-[#1D6FFF] text-white disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Save className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 