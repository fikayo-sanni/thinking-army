"use client"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ModernHeader } from "@/components/layout/modern-header"
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { PageTitleProvider } from "@/components/providers/page-title-provider"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className="bg-[#F9FAFC] dark:bg-[#0D0F1A]">
      <body className={`${inter.className} bg-[#F9FAFC] dark:bg-[#0D0F1A]`}>
        <PageTitleProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <AuthGate>
                  {children}
                </AuthGate>
              </AuthProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </PageTitleProvider>
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
  const isInviteRoute = pathname.startsWith('/invite/');
  const isPublicRoute = publicRoutes.includes(pathname) || isInviteRoute;
  const isAdminRoute = pathname.startsWith('/admin'); // Check if any admin route
  const authenticated = isMounted ? isAuthenticated() : false;

  useEffect(() => {
    if (!isMounted || processingCallback) return; // Don't redirect during OIDC callback processing
    
    // Don't redirect admin users away from admin pages - let them stay on admin routes
    if (isPublicRoute && authenticated && !isAdminRoute) {
      router.replace("/dashboard");
    }
    if (!isPublicRoute && !authenticated && !isAdminRoute) {
      router.replace("/");
    }
  }, [pathname, authenticated, isPublicRoute, isAdminRoute, router, isMounted, processingCallback]);

  if (!isMounted) return <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A]" />;
  
  // Show loading during OIDC callback processing
  if (processingCallback) {
    return <div className="flex items-center justify-center min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A]">
      <div className="text-lg text-black dark:text-white">Processing login...</div>
    </div>;
  }

  // ✅ ADMIN ROUTES: Always use clean layout (no sidebar/header) regardless of auth status
  if (isAdminRoute) {
    return <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A]">{children}</div>;
  }

  // ✅ PUBLIC ROUTES & INVITE ROUTES: Use clean layout  
  if (isPublicRoute) {
    return <div className="min-h-screen bg-[#F9FAFC] dark:bg-[#0D0F1A]">{children}</div>;
  }

  // ✅ PROTECTED USER ROUTES: Use full layout with sidebar and header
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ModernHeader />
        <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 bg-white dark:bg-[#23263A] rounded-none sm:rounded-xl shadow-sm mx-2 sm:mx-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
