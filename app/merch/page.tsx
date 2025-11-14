import { Suspense } from 'react'
import { Metadata } from 'next'
import MerchClient from './merch-client'

export const metadata: Metadata = {
  title: 'Cosmic Merch | SageSpace',
  description: 'Agent-designed cosmic merchandise for your journey'
}

export default function MerchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-white">Loading merch...</div></div>}>
        <MerchClient />
      </Suspense>
    </div>
  )
}
