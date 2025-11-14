'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Crown, Users, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { PLAN_DETAILS } from '@/lib/utils/subscription-features'

interface PaywallModalProps {
  featureName: string
  description: string
  highlightPlan?: 'pro' | 'enterprise'
  open: boolean
  onClose: () => void
}

export function PaywallModal({
  featureName,
  description,
  highlightPlan = 'pro',
  open,
  onClose,
}: PaywallModalProps) {
  const router = useRouter()

  const plan = highlightPlan === 'pro' ? PLAN_DETAILS.pro : PLAN_DETAILS.enterprise

  const benefits = highlightPlan === 'pro' ? [
    'All 300+ Sages unlocked',
    'Unlimited messages',
    'Unlimited Council sessions',
    'Full Memory history',
    'Advanced insights',
    'Custom Sages',
    'Automations',
  ] : [
    'Everything in Pro',
    'Team workspaces',
    'API access',
    'White-label options',
    'Priority support',
    'SSO & advanced security',
  ]

  const handleUpgrade = () => {
    router.push(`/subscriptions?from=${encodeURIComponent(featureName)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Cosmic background effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              {/* Content */}
              <div className="relative p-8 space-y-6">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header with icon */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    highlightPlan === 'pro' 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                  }`}>
                    {highlightPlan === 'pro' ? (
                      <Sparkles className="w-6 h-6 text-white" />
                    ) : (
                      <Crown className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Unlock {featureName}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Plan card */}
                <div className="bg-slate-800/50 rounded-xl p-6 space-y-4 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                      <p className="text-sm text-slate-400">{plan.blurb}</p>
                    </div>
                    <Badge className={highlightPlan === 'pro' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0' 
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0'
                    }>
                      {plan.headline}
                    </Badge>
                  </div>

                  {/* Benefits list */}
                  <div className="space-y-2">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-slate-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpgrade}
                    size="lg"
                    className={`flex-1 ${
                      highlightPlan === 'pro'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                        : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500'
                    } text-white`}
                  >
                    {highlightPlan === 'pro' ? 'Upgrade to Pro' : 'Contact for Enterprise'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={onClose}
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Not now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
