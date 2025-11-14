'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function CouncilError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Council Temporarily Unavailable</h1>
          <p className="text-muted-foreground">
            The Council chamber is recharging. Try again in a moment.
          </p>
        </div>

        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reconvene Council
        </Button>
      </div>
    </div>
  )
}
