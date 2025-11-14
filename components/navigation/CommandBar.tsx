"use client"

import { usePathname, useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, MessageSquare, Users, BookmarkCheck, TrendingUp, Globe2, Grid3x3, Layers, Book } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useJourney } from "@/lib/hooks/use-journey"
import { useNavigationState } from "@/lib/hooks/use-navigation-state"
import { useGlobalAudio } from "@/lib/stores/audio-store"
import { SageBeacon } from "./SageBeacon"
import { SageSwitch } from "./SageSwitch"
import { XPChip } from "./XPChip"
import { CommandBarItem } from "./CommandBarItem"
import { CommandBarUserSection } from "./CommandBarUserSection"
import type { XPTier } from "@/lib/types/navigation"
import { PlanBadge } from '@/components/PlanBadge'
import { useSubscription } from '@/lib/hooks/use-subscription'
import { AnimatedLogo } from '@/components/branding/AnimatedLogo'

const ROUTES = [
  { path: "/playground", label: "Playground", icon: MessageSquare },
  { path: "/council", label: "Council", icon: Users },
  { path: "/memory", label: "Memory", icon: BookmarkCheck },
  { path: "/observatory", label: "Observatory", icon: TrendingUp },
  { path: "/multiverse", label: "Multiverse", icon: Globe2 },
  { path: "/marketplace", label: "Marketplace", icon: Grid3x3 },
  { path: "/docs", label: "Docs", icon: Book },
]

export function CommandBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { context, nextRoute } = useJourney()
  const navState = useNavigationState()
  const audioState = useGlobalAudio()
  const { subscription, isFree, isLoading } = useSubscription()

  // Mock user stats - will be replaced with real data from Supabase
  const userStats = {
    xp: 2840,
    level: Math.floor(2840 / 1000) + 1,
    streak: 3,
    tier: (Math.floor(2840 / 1000) + 1) as XPTier,
    initials: "SU",
  }

  const hasActiveSession = context.activeSageIds.length > 0

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/20 bg-black/80 backdrop-blur-xl"
    >
      {/* Cosmic particle effect - optional subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        {/* Left: Logo + SageSwitch + Navigation */}
        <div className="flex items-center gap-3">
          {/* Logo with animations */}
          <Link href="/" className="flex items-center group relative mr-2">
            <AnimatedLogo size="sm" showText={true} animate={true} />
          </Link>

          {/* Sage Switch */}
          <SageSwitch
            activeSage={navState.activeSage}
            onSwitch={() => router.push("/marketplace")}
            onSpin={() => router.push("/universe-map")}
            onCouncil={() => router.push("/council")}
          />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex ml-2">
            {ROUTES.map((route) => {
              const isActive = pathname === route.path
              
              // Dynamic indicators based on route
              let indicator = undefined
              if (route.path === "/playground" && hasActiveSession) {
                indicator = { type: "pulse" as const }
              } else if (route.path === "/council" && context.activeSageIds.length > 1) {
                indicator = { type: "count" as const, value: context.activeSageIds.length }
              } else if (route.path === "/memory" && navState.insights > 0) {
                indicator = { type: "dot" as const }
              } else if (route.path === "/multiverse" && navState.notifications > 0) {
                indicator = { type: "count" as const, value: navState.notifications }
              }

              return (
                <CommandBarItem
                  key={route.path}
                  path={route.path}
                  label={route.label}
                  icon={route.icon}
                  isActive={isActive}
                  indicator={indicator}
                />
              )
            })}
          </div>

          {/* Mobile Menu Icon */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Layers className="h-5 w-5" />
          </Button>
        </div>

        {/* Center: Sage Beacon */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block">
          <SageBeacon status={navState.systemStatus} />
        </div>

        {/* Right: Plan Badge, Upgrade, Continue Journey, XP, User */}
        <div className="flex items-center gap-3">
          {!isLoading && subscription && (
            <>
              <PlanBadge planId={subscription.planId} />
              
              {isFree && (
                <Link href="/subscriptions">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </>
          )}

          {/* Continue/Resume Journey Button */}
          <Link href={nextRoute}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700 relative overflow-hidden group"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                <span>{hasActiveSession ? "Resume" : "Begin"} Journey</span>
                
                {/* Star trail on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
          </Link>

          <XPChip onClick={() => router.push('/profile')} />

          <CommandBarUserSection />
        </div>
      </div>
    </motion.nav>
  )
}
