"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/services/auth-service";
import { AuthLayout } from "@/components/auth/auth-layout";

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

  return (
    <AuthLayout
      title="SIGN IN"
      description="Sign in with your YOURE.ID account to access your dashboard"
    >
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6 p-8"
          noValidate
          autoComplete="off"
        >
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="youreid" className="block mb-2 text-sm font-medium">
              YoureID
            </label>
            <Input
              id="youreid"
              type="text"
              placeholder="Enter your YoureID"
              value={youre_id}
              onChange={(e) => setYoureId(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.youre_id && <p className="text-red-500 text-sm mt-1">{errors.youre_id}</p>}
          </div>

          {serverError && <div className="text-red-500 text-sm">{serverError}</div>}

          <div className="flex flex-col items-center justify-center">
            <Button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white dark:text-white w-full rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
