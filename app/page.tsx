import { Starfield } from '@/components/homepage-v2/Starfield'
import { GenesisChamberHero } from '@/components/homepage-v2/GenesisChamberHero'
import { SageEngineOverview } from '@/components/homepage-v2/SageEngineOverview'
import { SageGalaxyPreview } from '@/components/homepage-v2/SageGalaxyPreview'
import { SagesShowcase } from '@/components/homepage-v2/SagesShowcase'
import { MemoryCouncilSection } from '@/components/homepage-v2/MemoryCouncilSection'
import { SubscriptionTeaser } from '@/components/homepage-v2/SubscriptionTeaser'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated starfield background */}
      <Starfield />

      {/* Main content sections */}
      <div className="relative z-10">
        <GenesisChamberHero />
        <SageEngineOverview />
        <SageGalaxyPreview />
        <SagesShowcase />
        <MemoryCouncilSection />
        <SubscriptionTeaser />
      </div>
    </div>
  )
}
