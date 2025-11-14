'use client'

import { motion } from 'framer-motion'
import { Sparkles, Crown, Star, Zap, Orbit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { SubscriptionPlanId } from '@/lib/types/subscription'
import { PLAN_DETAILS } from '@/lib/utils/subscription-features'

interface PlanBadgeProps {
  planId: SubscriptionPlanId
  className?: string
}

export function PlanBadge({ planId, className = '' }: PlanBadgeProps) {
  const normalizedPlanId = (() => {
    if (planId === 'free' || planId === 'explorer') return 'explorer'
    if (planId === 'pro' || planId === 'astral') return 'astral'
    if (planId === 'enterprise' || planId === 'celestial') return 'celestial'
    return planId
  })() as SubscriptionPlanId

  const plan = PLAN_DETAILS[normalizedPlanId]
  
  if (!plan) {
    console.warn(`[v0] Unknown plan ID: ${planId}, falling back to explorer`)
    return (
      <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
        <Sparkles className="w-3 h-3 mr-1" />
        <span className="text-xs font-medium">Explorer</span>
      </Badge>
    )
  }

  const getBadgeStyle = () => {
    switch (normalizedPlanId) {
      case 'explorer':
        return 'border-cyan-500/50 text-cyan-400 hover:border-cyan-400'
      case 'voyager':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-300 hover:border-blue-400'
      case 'astral':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 text-purple-300 hover:border-purple-400'
      case 'oracle':
        return 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/50 text-pink-300 hover:border-pink-400'
      case 'celestial':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 hover:border-yellow-400'
      default:
        return 'border-cyan-500/50 text-cyan-400 hover:border-cyan-400'
    }
  }

  const getIcon = () => {
    switch (normalizedPlanId) {
      case 'explorer':
        return <Sparkles className="w-3 h-3" />
      case 'voyager':
        return <Star className="w-3 h-3" />
      case 'astral':
        return <Zap className="w-3 h-3" />
      case 'oracle':
        return <Orbit className="w-3 h-3" />
      case 'celestial':
        return <Crown className="w-3 h-3" />
      default:
        return <Sparkles className="w-3 h-3" />
    }
  }

  return (
    <Link href="/subscriptions">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Badge
          variant="outline"
          className={`${getBadgeStyle()} cursor-pointer transition-colors gap-1.5 ${className}`}
        >
          {getIcon()}
          <span className="text-xs font-medium">{plan.name}</span>
        </Badge>
      </motion.div>
    </Link>
  )
}
