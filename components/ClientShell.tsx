'use client'

import dynamic from 'next/dynamic'

// This keeps app/layout.tsx as pure server component
const CommandBarWrapper = dynamic(() => import("@/components/navigation/CommandBarWrapper"), {
  ssr: false
})

const GlobalSpotifyPlayer = dynamic(() => import("@/components/GlobalSpotifyPlayer"), {
  ssr: false
})

const CosmicBackground = dynamic(() => import("@/components/CosmicBackground"), {
  ssr: false
})

const ObservabilityTracker = dynamic(() => import("@/components/observability-tracker"), {
  ssr: false
})

const StreakBanner = dynamic(() => import("@/components/engagement/StreakBanner"), {
  ssr: false
})

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CosmicBackground />
      <div className="relative z-10">
        <ObservabilityTracker />
        <CommandBarWrapper />
        <StreakBanner />
        {children}
        <GlobalSpotifyPlayer />
      </div>
    </>
  )
}
