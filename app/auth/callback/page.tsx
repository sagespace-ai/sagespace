'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesIcon } from "@/components/icons"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      // Get hash fragment from URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const type = hashParams.get('type')
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      console.log('[v0] Auth callback type:', type)
      console.log('[v0] Has access token:', !!accessToken)

      if (type === 'recovery' && accessToken) {
        // Password reset flow
        console.log('[v0] Processing password recovery...')
        
        try {
          // Set the session using the tokens from the hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })

          if (error) throw error

          console.log('[v0] Session established, redirecting to reset password page')
          setStatus('success')
          
          // Redirect to reset password page with valid session
          router.push('/auth/reset-password')
        } catch (err: any) {
          console.error('[v0] Password recovery error:', err)
          setError(err.message || 'Failed to verify reset link')
          setStatus('error')
        }
      } else if (type === 'signup') {
        // Email confirmation flow
        console.log('[v0] Processing email confirmation...')
        router.push('/auth/login?confirmed=true')
      } else {
        // Invalid or missing type
        console.error('[v0] Invalid callback type or missing token')
        setError('Invalid or expired link')
        setStatus('error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black flex items-center justify-center p-4">
      {/* Animated stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <Card className="relative w-full max-w-md bg-slate-900/80 border-purple-500/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <SparklesIcon className="w-12 h-12 text-cyan-400" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {status === 'loading' && 'Verifying...'}
            {status === 'success' && 'Verified!'}
            {status === 'error' && 'Error'}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {status === 'loading' && 'Please wait while we verify your link'}
            {status === 'success' && 'Redirecting you now...'}
            {status === 'error' && 'Something went wrong'}
          </CardDescription>
        </CardHeader>
        {status === 'error' && (
          <CardContent>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive-foreground text-sm text-center">{error}</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
