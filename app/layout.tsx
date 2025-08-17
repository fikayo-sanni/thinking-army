import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import AppLayout from '@/components/layout/AppLayout'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { PageTitleProvider } from '@/components/providers/page-title-provider'
import { AuthProvider } from '@/lib/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Thinking Army - AI Agents Platform',
  description: 'A platform of ready-to-use AI agents for businesses of all sizes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <Providers>
            <AuthProvider>
              <PageTitleProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </PageTitleProvider>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
} 