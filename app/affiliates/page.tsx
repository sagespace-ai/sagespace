import { Suspense } from 'react'
import { Metadata } from 'next'
import AffiliatesClient from './affiliates-client'

export const metadata: Metadata = {
  title: 'Sage Recommendations | SageSpace',
  description: 'Discover curated tools and resources for your journey'
}

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-white">Loading recommendations...</div></div>}>
        <AffiliatesClient />
      </Suspense>
    </div>
  )
}
