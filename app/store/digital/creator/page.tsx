import { Suspense } from 'react'
import { Metadata } from 'next'
import CreatorDashboardClient from './creator-dashboard-client'

export const metadata: Metadata = {
  title: 'Creator Dashboard | SageSpace',
  description: 'Manage your digital products and earnings'
}

export default function CreatorDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-white">Loading dashboard...</div></div>}>
        <CreatorDashboardClient />
      </Suspense>
    </div>
  )
}
