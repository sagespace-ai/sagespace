"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "@/components/icons"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Demo page error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-sm border border-border/30 rounded-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-text-secondary">
            We encountered an error loading your universe. This has been logged for investigation.
          </p>
          {error.digest && <p className="text-xs text-text-muted font-mono">Error ID: {error.digest}</p>}
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full bg-primary hover:bg-primary/90">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
}
