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
    <html lang="en" className="bg-[#F9FAFC] dark:bg-[#0D0F1A]">
      <body className={`${inter.className} bg-[#F9FAFC] dark:bg-[#0D0F1A]`}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AuthGate>
                {children}
              </AuthGate>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, processingCallback } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { 
    // Small delay to ensure localStorage is ready
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const publicRoutes = ["/admin", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const authenticated = isMounted ? isAuthenticated() : false;

  useEffect(() => {
    if (!isMounted || processingCallback) return; // Don't redirect during OIDC callback processing
    
    if (isPublicRoute && authenticated) {
      router.replace("/dashboard");
    }
    if (!isPublicRoute && !authenticated) {
      router.replace("/");
    }
  }, [pathname, authenticated, isPublicRoute, router, isMounted, processingCallback]);

  if (!isMounted) return <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A]" />;
  
  // Show loading during OIDC callback processing
  if (processingCallback) {
    return <div className="flex items-center justify-center min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A]">
      <div className="text-lg text-black dark:text-white">Processing login...</div>
    </div>;
  }

  if (isPublicRoute) {
    return <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A]">{children}</div>;
  }

  return (
    <ModernSidebar>
      <div className="min-h-screen bg-[#F7F8F8] dark:bg-[#1A1E2D] text-black dark:text-white">
        <ModernHeader />
        <div className="p-6 space-y-6 bg-white dark:bg-[#23263A] rounded-xl shadow-sm" >
          {children}
        </div>
      </div>
    </ModernSidebar>
  );
}
