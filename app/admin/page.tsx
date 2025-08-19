"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/services/auth-service";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Mail, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [youre_id, setYoureId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; youre_id?: string }>({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.includes("@")) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    if (!youre_id) newErrors.youre_id = "YoureID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await authService.adminLogin(email, password, youre_id);
      router.push("/dashboard");
    } catch (err) {
      console.log(err)
      setServerError("Login failed. Please check your login details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerContent = (
    <div className="space-x-4">
      <a href="/terms" className="hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">Terms and Conditions</a>
      <span>•</span>
      <a href="/privacy" className="hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">Privacy Policy</a>
      <span>•</span>
      <a href="/support" className="hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">Support</a>
    </div>
  );

  return (
    <AuthLayout
      title="Sign in"
      description="Sign in with your YOURE.ID account to access your dashboard"
      footer={footerContent}
    >
      <div className="w-full max-w-sm mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-[#202124] dark:text-[#E6E6E6] font-medium">
              Email address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail className="h-4 w-4 text-[#5F6368] dark:text-[#A0A0A0]" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="h-9 pl-10 bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] focus:border-[#297EFF] focus:ring-[#297EFF]/10"
              />
            </div>
            {errors.email && (
              <p className="text-[#FF3B30] dark:text-[#FF453A] text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-[#202124] dark:text-[#E6E6E6] font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Lock className="h-4 w-4 text-[#5F6368] dark:text-[#A0A0A0]" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="h-9 pl-10 bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] focus:border-[#297EFF] focus:ring-[#297EFF]/10"
              />
            </div>
            {errors.password && (
              <p className="text-[#FF3B30] dark:text-[#FF453A] text-sm">{errors.password}</p>
            )}
          </div>

          {/* YoureID Input */}
          <div className="space-y-2">
            <label htmlFor="youreid" className="block text-sm text-[#202124] dark:text-[#E6E6E6] font-medium">
              YoureID
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <User className="h-4 w-4 text-[#5F6368] dark:text-[#A0A0A0]" />
              </div>
              <Input
                id="youreid"
                type="text"
                placeholder="Enter your YoureID"
                value={youre_id}
                onChange={(e) => setYoureId(e.target.value)}
                disabled={isSubmitting}
                className="h-9 pl-10 bg-white  border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] focus:border-[#297EFF] focus:ring-[#297EFF]/10"
              />
            </div>
            {errors.youre_id && (
              <p className="text-[#FF3B30] dark:text-[#FF453A] text-sm">{errors.youre_id}</p>
            )}
          </div>

          {serverError && (
            <div className="text-[#FF3B30] dark:text-[#FF453A] text-sm text-center">
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-9 bg-[#297EFF] hover:bg-[#1D6FFF] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
