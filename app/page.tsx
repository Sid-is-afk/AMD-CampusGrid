"use client"
import { Suspense, useEffect, useState } from "react"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { AuthPage } from "@/components/auth-page"
import { Dashboard } from "@/components/dashboard"
import { LandingPage } from "@/components/landing/landing-page"
import { useSearchParams } from "next/navigation"

function AppRouter() {
  const { isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  // Always show auth page if mode is auth
  if (mode === 'signin' || mode === 'signup') {
    return <AuthPage initialMode={mode === 'signup' ? 'signup' : 'signin'} />
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard />
  }

  // Default to landing page for unauthenticated users
  return <LandingPage />
}

export default function Home() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="grid-bg min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-neon-blue border-t-transparent" /></div>}>
        <AppRouter />
      </Suspense>
    </AuthProvider>
  )
}
