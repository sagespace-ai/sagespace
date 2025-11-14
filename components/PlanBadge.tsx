'use client'

import { motion } from 'framer-motion'
import { Sparkles, Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { SubscriptionPlanId } from '@/lib/types/subscription'
import { PLAN_DETAILS } from '@/lib/utils/subscription-features'

interface PlanBadgeProps {
  planId: SubscriptionPlanId
  className?: string
}

export function PlanBadge({ planId, className = '' }: PlanBadgeProps) {
  const plan = PLAN_DETAILS[planId]

  const getBadgeStyle = () => {
    switch (planId) {
      case 'free':
        return 'border-cyan-500/50 text-cyan-400 hover:border-cyan-400'
      case 'pro':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 text-purple-300 hover:border-purple-400'
      case 'enterprise':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 hover:border-yellow-400'
    }
  }

  const getIcon = () => {
    switch (planId) {
      case 'free':
        return <Sparkles className="w-3 h-3" />
      case 'pro':
        return <Sparkles className="w-3 h-3" />
      case 'enterprise':
        return <Crown className="w-3 h-3" />
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
