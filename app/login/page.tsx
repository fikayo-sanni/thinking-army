"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/services/auth-service";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function LoginPage() {
  const [youreId, setYoureId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.loginWithYoureId(youreId);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Login failed. Please check your YoureID and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="SIGN IN"
      description="Sign in with your YOURE.ID account to access your dashboard"
    >
      <div className="flex flex-col items-center justify-center min-h-[200px] ">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6 rounded-lg p-8 shadow-lg"
        >
          <div>
            <label htmlFor="youreid" className="block mb-2 text-sm font-medium">
              YoureID
            </label>
            <Input
              id="youreid"
              type="text"
              value={youreId}
              onChange={(e) => setYoureId(e.target.value)}
              placeholder="Enter your YoureID"
              required
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex flex-col items-center justify-center">
            <Button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white dark:text-white w-full rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
              disabled={loading || !youreId}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
