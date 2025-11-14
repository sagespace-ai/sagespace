'use client'

import React from 'react'
import { CommandBarWrapper } from '@/components/navigation/CommandBarWrapper'
import { GlobalSpotifyPlayer } from '@/components/GlobalSpotifyPlayer'
import CosmicBackground from '@/components/CosmicBackground'
import { ObservabilityTracker } from '@/components/observability-tracker'
import StreakBanner from '@/components/engagement/StreakBanner'

type ClientShellProps = {
  children: React.ReactNode
}

export default function ClientShell({ children }: ClientShellProps) {
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
