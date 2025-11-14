"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { OnboardingWizard } from './components/OnboardingWizard'
import { GenesisDashboard } from './components/GenesisDashboard'
import { CompanionChat } from './components/CompanionChat'
import { useSubscription } from '@/lib/hooks/use-subscription'
import { PLAN_DETAILS } from '@/lib/utils/subscription-features'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function GenesisClient() {
  const [loading, setLoading] = useState(true)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [showCompanion, setShowCompanion] = useState(false)
  const { subscription, features, isFree, isPro, isEnterprise, isLoading: subLoading } = useSubscription()

  useEffect(() => {
    loadProgress()
  }, [])

  async function loadProgress() {
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('genesis_onboarding')
        if (storedData) {
          const parsed = JSON.parse(storedData)
          console.log('[v0] Found onboarding data in localStorage:', parsed)
          if (parsed.completed) {
            setOnboardingComplete(true)
            setLoading(false)
            return
          }
        }
      }

      // If not in localStorage, check API
      const res = await fetch('/api/genesis/profile')
      if (res.ok) {
        const data = await res.json()
        console.log('[v0] Genesis profile API response:', data)
        setOnboardingComplete(data.onboarding_completed || false)
      }
    } catch (error) {
      console.error('[v0] Error loading genesis progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || subLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Plan summary strip below header */}
      {onboardingComplete && subscription && (
        <div className="relative z-20 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-300">
                {isFree && (
                  <>
                    You're a <span className="font-semibold text-cyan-400">{PLAN_DETAILS.free.name}</span> on the Free plan. 
                    <span className="text-slate-400"> Explore SageSpace and unlock more power with Pro.</span>
                  </>
                )}
                {isPro && (
                  <>
                    You're a <span className="font-semibold text-purple-400">{PLAN_DETAILS.pro.name}</span>. 
                    <span className="text-slate-400"> You have full access to all Sages and advanced insights.</span>
                  </>
                )}
                {isEnterprise && (
                  <>
                    You're a <span className="font-semibold text-yellow-400">{PLAN_DETAILS.enterprise.name}</span>. 
                    <span className="text-slate-400"> Team workspaces, APIs, and white-label are enabled.</span>
                  </>
                )}
              </p>
              <Link href="/subscriptions" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Manage plan
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!onboardingComplete ? (
          <OnboardingWizard 
            key="onboarding"
            onComplete={() => {
              setOnboardingComplete(true)
              loadProgress()
            }}
          />
        ) : (
          <GenesisDashboard 
            key="dashboard"
            onOpenCompanion={() => setShowCompanion(true)}
          />
        )}
      </AnimatePresence>

      {/* Floating Companion Chat */}
      <AnimatePresence>
        {showCompanion && (
          <CompanionChat 
            onClose={() => setShowCompanion(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
