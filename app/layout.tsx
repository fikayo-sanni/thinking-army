"use client"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth/AuthProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ModernSidebar } from "@/components/layout/modern-sidebar"
import { ModernHeader } from "@/components/layout/modern-header"
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // Define public routes (no sidebar/header)
  const publicRoutes = ["/login", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const authenticated = isMounted ? isAuthenticated() : false;

  useEffect(() => {
    if (!isMounted) return;
    // If on login or landing and authenticated, redirect to dashboard
    if (isPublicRoute && authenticated) {
      router.replace("/dashboard");
    }
    // If on a protected route and not authenticated, redirect to login
    if (!isPublicRoute && !authenticated) {
      router.replace("/login");
    }
  }, [pathname, authenticated, isPublicRoute, router, isMounted]);

  // Prevent SSR mismatch by not rendering until mounted
  if (!isMounted) return null;

  // For login and landing, if not authenticated, show only children (no layout)
  if (isPublicRoute) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                {children}
              </AuthProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  // For authenticated users on protected routes, show full layout
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ModernSidebar>
                <div className="min-h-screen bg-[#F7F8F8] dark:bg-[#1A1E2D] text-black dark:text-white">
                  <ModernHeader />
                  <div className="p-6 space-y-6 bg-white dark:bg-[#23263A] rounded-xl shadow-sm">
                    {children}
                  </div>
                </div>
              </ModernSidebar>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
