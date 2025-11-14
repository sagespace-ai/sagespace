"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CreditCard, Check, Sparkles, Zap, Crown, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSubscription } from '@/lib/hooks/use-subscription'
import { getFeaturesForPlan, PLAN_DETAILS } from '@/lib/utils/subscription-features'
import { useToast } from '@/hooks/use-toast'

const PLAN_FEATURES = {
  free: [
    'Full Genesis Chamber access',
    'Origin Sage companion',
    '3 rotating Discovery Sages',
    '75 messages per day',
    '7-day memory history',
    '20 saved artifacts',
    'Basic insights dashboard',
    'Community support',
  ],
  pro: [
    'All 300+ Sages unlocked',
    'Unlimited messages',
    'Full memory history',
    'Unlimited council size (6 Sages)',
    'Unlimited council sessions',
    '500 saved artifacts',
    'Advanced insights & analytics',
    'Custom Sage creation',
    'Automation & routines',
    'Priority support',
  ],
  enterprise: [
    'Everything in Pro',
    'Team workspaces',
    'API access',
    'SSO & role-based access',
    'White-label branding',
    'Governance controls',
    'Custom integrations',
    'Dedicated support & SLAs',
  ],
}

const PLAN_CONFIG = [
  {
    id: 'free' as const,
    name: 'Genesis Explorer',
    headline: '$0 / forever',
    icon: Sparkles,
    features: PLAN_FEATURES.free,
  },
  {
    id: 'pro' as const,
    name: 'Sage Voyager',
    headline: '$9 / month',
    icon: Zap,
    features: PLAN_FEATURES.pro,
    popular: true,
  },
  {
    id: 'enterprise' as const,
    name: 'Council Architect',
    headline: '$49 / month',
    icon: Crown,
    features: PLAN_FEATURES.enterprise,
  },
]

export function SubscriptionsPageClient() {
  const router = useRouter()
  const { toast } = useToast()
  const { subscription, isLoading, changePlan, refetch } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  const [isChanging, setIsChanging] = useState(false)

  async function handleSelectPlan(planId: string) {
    // If it's the current plan, do nothing
    if (planId === subscription?.planId) {
      return
    }

    // Fetch preview
    try {
      const res = await fetch('/api/subscriptions/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      if (!res.ok) throw new Error('Failed to preview plan')

      const data = await res.json()
      setPreviewData(data)
      setSelectedPlan(planId)
    } catch (error) {
      console.error('[v0] Error previewing plan:', error)
      toast({
        title: 'Error',
        description: 'Failed to preview plan change',
        variant: 'destructive',
      })
    }
  }

  async function handleConfirmChange() {
    if (!selectedPlan) return

    setIsChanging(true)
    try {
      const success = await changePlan(selectedPlan)
      
      if (success) {
        toast({
          title: 'Success!',
          description: `Your plan has been updated to ${PLAN_CONFIG.find(p => p.id === selectedPlan)?.name}`,
        })
        setSelectedPlan(null)
        setPreviewData(null)
        await refetch()
      } else {
        throw new Error('Failed to change plan')
      }
    } catch (error) {
      console.error('[v0] Error changing plan:', error)
      toast({
        title: 'Error',
        description: 'Failed to update plan',
        variant: 'destructive',
      })
    } finally {
      setIsChanging(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    )
  }

  const currentPlanId = subscription?.planId || 'free'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 hover:bg-purple-500/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Subscriptions
            </h1>
            <p className="text-slate-300 text-lg">
              Choose the plan that fits your wisdom-seeking journey
            </p>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {PLAN_CONFIG.map((plan) => {
            const Icon = plan.icon
            const isCurrent = plan.id === currentPlanId
            
            return (
              <motion.div
                key={plan.id}
                whileHover={!isCurrent ? { scale: 1.02 } : {}}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <Card 
                  className={`h-full transition-all ${
                    isCurrent 
                      ? 'bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border-purple-400 shadow-lg shadow-purple-500/20' 
                      : 'bg-slate-900/50 border-purple-500/20 hover:border-purple-400/40'
                  } ${plan.popular && !isCurrent ? 'border-purple-500' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${isCurrent ? 'text-cyan-400' : 'text-purple-400'}`} />
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </div>
                      {isCurrent && (
                        <div className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-400/30">
                          Current
                        </div>
                      )}
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold">{plan.headline.split(' / ')[0]}</span>
                      <span className="text-slate-400 mb-1 text-sm">/ {plan.headline.split(' / ')[1]}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className={`w-full ${
                        isCurrent
                          ? 'bg-gradient-to-r from-purple-600/50 to-cyan-600/50 cursor-default'
                          : plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500'
                          : 'bg-slate-800 hover:bg-slate-700 border border-purple-500/20'
                      }`}
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Current Plan' : plan.id === 'pro' || plan.id === 'enterprise' ? 'Upgrade' : 'Downgrade'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Billing Management */}
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-purple-400" />
              Billing Management
            </CardTitle>
            <CardDescription className="text-slate-300">
              Subscriptions are in preview mode. Payment options will be available soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">
              Once configured, you'll be able to manage payment methods, view billing history, and update your subscription here.
            </p>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-purple-500/20 hover:bg-purple-500/10"
                disabled
              >
                Manage Payment Methods
              </Button>
              <Button 
                variant="outline"
                className="border-purple-500/20 hover:bg-purple-500/10"
                disabled
              >
                View Billing History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Change Confirmation Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => {
        setSelectedPlan(null)
        setPreviewData(null)
      }}>
        <DialogContent className="bg-slate-900 border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {previewData?.isUpgrade ? 'Upgrade' : 'Downgrade'} Subscription
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {previewData?.isUpgrade 
                ? `Unlock the full power of SageSpace with ${previewData?.targetPlan?.name}`
                : `Switch to ${previewData?.targetPlan?.name}`
              }
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-400">Current Plan</p>
                  <p className="font-semibold">{previewData.currentPlan.name}</p>
                </div>
                <ArrowLeft className="h-5 w-5 text-slate-500 rotate-180" />
                <div>
                  <p className="text-sm text-slate-400">New Plan</p>
                  <p className="font-semibold text-cyan-400">{previewData.targetPlan.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-purple-400">Key Feature Changes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>
                      Sages: {previewData.featureDiffs.sages.current} → {previewData.featureDiffs.sages.new === 'all' ? 'All 300+' : previewData.featureDiffs.sages.new}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>
                      Messages: {previewData.featureDiffs.messages.current}/day → {previewData.featureDiffs.messages.new === 'unlimited' ? 'Unlimited' : `${previewData.featureDiffs.messages.new}/day`}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>
                      Memory: {previewData.featureDiffs.memory.current === 'full' ? 'Full history' : `${previewData.featureDiffs.memory.current} days`} → {previewData.featureDiffs.memory.new === 'full' ? 'Full history' : `${previewData.featureDiffs.memory.new} days`}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-xs text-slate-300">
                  Note: This is a preview subscription system. Actual billing will be integrated with Stripe soon.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedPlan(null)
                setPreviewData(null)
              }}
              disabled={isChanging}
              className="border-purple-500/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmChange}
              disabled={isChanging}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
            >
              {isChanging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Confirm Change'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
