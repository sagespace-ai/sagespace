"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleLogo } from "@/components/branding/SimpleLogo"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Error boundary caught:", error)
  }, [error])

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

      <Card className="relative w-full max-w-md bg-slate-900/80 border-red-500/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <SimpleLogo size="lg" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-slate-400">
            Don't worry, your data is safe. Let's get you back on track.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-300 text-sm font-mono break-all">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={reset}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="w-full border-slate-700 text-white hover:bg-slate-800"
            >
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
