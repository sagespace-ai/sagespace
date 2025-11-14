import { Suspense } from 'react'
import { Metadata } from 'next'
import DigitalMarketplaceClient from './digital-marketplace-client'

export const metadata: Metadata = {
  title: 'Digital Marketplace | SageSpace',
  description: 'Discover digital goods created by the SageSpace community'
}

export default function DigitalMarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-white">Loading marketplace...</div></div>}>
        <DigitalMarketplaceClient />
      </Suspense>
    </div>
  )
}
