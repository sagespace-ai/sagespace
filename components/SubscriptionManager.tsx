"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Zap, Crown, Sparkles, ArrowRight } from "@/components/icons"
import type { SubscriptionPlanId } from "@/lib/types/subscription"

interface SubscriptionData {
  subscription: {
    id: string
    planId: SubscriptionPlanId
    status: string
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
  }
  features: any
  isPro: boolean
  isEnterprise: boolean
  isFree: boolean
}

export function SubscriptionManager() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [changingPlan, setChangingPlan] = useState(false)

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/subscriptions/me')
      if (res.ok) {
        const data = await res.json()
        setSubscriptionData(data)
      }
    } catch (error) {
      console.error('[v0] Failed to load subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: SubscriptionPlanId) => {
    try {
      setChangingPlan(true)
      const res = await fetch('/api/subscriptions/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      if (res.ok) {
        await loadSubscription()
        alert('Plan upgraded successfully!')
      } else {
        const data = await res.json()
        alert(`Failed to upgrade: ${data.error}`)
      }
    } catch (error) {
      console.error('[v0] Failed to upgrade plan:', error)
      alert('Failed to upgrade. Please try again.')
    } finally {
      setChangingPlan(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      return
    }

    try {
      setChangingPlan(true)
      const res = await fetch('/api/subscriptions/cancel', { method: 'POST' })

      if (res.ok) {
        await loadSubscription()
        alert('Subscription cancelled. You will retain access until the end of your billing period.')
      } else {
        const data = await res.json()
        alert(`Failed to cancel: ${data.error}`)
      }
    } catch (error) {
      console.error('[v0] Failed to cancel subscription:', error)
      alert('Failed to cancel. Please try again.')
    } finally {
      setChangingPlan(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
        <div className="flex items-center justify-center py-12">
          <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </Card>
    )
  }

  const currentPlan = subscriptionData?.subscription.planId || 'free'
  const features = subscriptionData?.features || {}

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Current Plan</h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {currentPlan === 'free' && 'Genesis Explorer'}
                {currentPlan === 'pro' && 'Sage Voyager'}
                {currentPlan === 'enterprise' && 'Council Architect'}
              </span>
              {currentPlan === 'pro' && <Zap className="w-6 h-6 text-yellow-400" />}
              {currentPlan === 'enterprise' && <Crown className="w-6 h-6 text-purple-400" />}
            </div>
          </div>
          {subscriptionData?.subscription.cancelAtPeriodEnd && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
              <p className="text-sm text-yellow-400">Cancels on {new Date(subscriptionData.subscription.currentPeriodEnd!).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Sages Unlocked</p>
            <p className="text-2xl font-bold text-white">
              {features.maxSagesUnlocked === 'all' ? '300+' : features.maxSagesUnlocked}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Daily Messages</p>
            <p className="text-2xl font-bold text-white">
              {features.messagesPerDay === 'unlimited' ? '∞' : features.messagesPerDay}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Council Sessions</p>
            <p className="text-2xl font-bold text-white">
              {features.councilSessionsPerDay === 'unlimited' ? '∞' : features.councilSessionsPerDay}/day
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Memory Retention</p>
            <p className="text-2xl font-bold text-white">
              {features.memoryRetentionDays === 'full' ? '∞' : `${features.memoryRetentionDays}d`}
            </p>
          </div>
        </div>

        {currentPlan !== 'free' && !subscriptionData?.subscription.cancelAtPeriodEnd && (
          <Button
            onClick={handleCancelSubscription}
            disabled={changingPlan}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Cancel Subscription
          </Button>
        )}
      </Card>

      {/* Upgrade Options */}
      {currentPlan === 'free' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pro Plan */}
          <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border-cyan-500/30 p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sage Voyager</h3>
            <p className="text-4xl font-bold text-cyan-400 mb-4">
              $9<span className="text-lg text-gray-400">/month</span>
            </p>
            <p className="text-gray-300 mb-6">For power users who live inside SageSpace</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">All 300+ Sages unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Unlimited messages & Council sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Full memory retention</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Custom Sage creation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Advanced insights & analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Automations enabled</span>
              </div>
            </div>

            <Button
              onClick={() => handleUpgrade('pro')}
              disabled={changingPlan}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              {changingPlan ? 'Upgrading...' : 'Upgrade to Pro'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border-purple-500/30 p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Crown className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Council Architect</h3>
            <p className="text-4xl font-bold text-purple-400 mb-4">
              $49<span className="text-lg text-gray-400">/month</span>
            </p>
            <p className="text-gray-300 mb-6">For teams, firms, and white-label deployments</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Everything in Pro, plus:</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Unlimited Council participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Team workspaces & collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">API access for integrations</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">White-label deployment options</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-200">Priority support & onboarding</span>
              </div>
            </div>

            <Button
              onClick={() => handleUpgrade('enterprise')}
              disabled={changingPlan}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {changingPlan ? 'Upgrading...' : 'Upgrade to Enterprise'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      )}

      {/* Billing History - Coming Soon */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6 opacity-50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Billing History</h3>
            <p className="text-gray-400 text-sm">View and download past invoices</p>
          </div>
          <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">Coming Soon</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded border border-slate-700 bg-slate-900/30">
            <div>
              <p className="text-white font-semibold">January 2025</p>
              <p className="text-sm text-gray-400">Sage Voyager - Monthly</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">$9.00</p>
              <p className="text-xs text-green-400">Paid</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
