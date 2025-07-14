"use client"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AuthGate>{children}</AuthGate>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const publicRoutes = ["/login", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const authenticated = isMounted ? isAuthenticated() : false;

  useEffect(() => {
    if (!isMounted) return;
    if (isPublicRoute && authenticated) {
      router.replace("/dashboard");
    }
    if (!isPublicRoute && !authenticated) {
      router.replace("/login");
    }
  }, [pathname, authenticated, isPublicRoute, router, isMounted]);

  if (!isMounted) return null;

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <ModernSidebar>
      <div className="min-h-screen bg-[#F7F8F8] dark:bg-[#1A1E2D] text-black dark:text-white">
        <ModernHeader />
        <div className="p-6 space-y-6 bg-white dark:bg-[#23263A] rounded-xl shadow-sm">
          {children}
        </div>
      </div>
    </ModernSidebar>
  );
}
