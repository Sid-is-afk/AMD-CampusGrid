import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/lib/theme-context'
import { PromotionsProvider } from '@/lib/promotions-context'
import { AuthProvider } from '@/lib/auth-context' // <-- 1. Added this import
import './globals.css'

const _geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'CampusGrid - Smart Campus Resource Allocation',
  description: 'Real-time resource allocation engine for smart campus management. Monitor, bid, and manage campus resources efficiently.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a14',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_geist.variable} ${_geistMono.variable} ${_jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <PromotionsProvider>
            {/* 2. Wrapped children and toaster in AuthProvider */}
            <AuthProvider>
              {children}
              <Toaster
                theme="dark"
                toastOptions={{
                  style: {
                    background: 'oklch(0.16 0.005 260 / 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid oklch(0.4 0.01 260 / 0.3)',
                    color: 'oklch(0.95 0.01 250)',
                  },
                }}
              />
            </AuthProvider>
          </PromotionsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}