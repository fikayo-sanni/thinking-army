"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/services/auth-service";

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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-lg bg-card p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
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
        <Button type="submit" className="w-full" disabled={loading || !youreId}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
} 