"use client"

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { Zap } from 'lucide-react'
import { computeLevelFromXP, progressToNextLevel, getTierFromLevel } from '@/lib/utils/level-system'
import type { XPTier } from "@/lib/types/navigation"

const TIER_COLORS = {
  1: "from-teal-500 to-cyan-500",
  2: "from-indigo-500 to-blue-500",
  3: "from-purple-500 to-pink-500",
  4: "from-amber-500 to-yellow-500",
}

interface XPChipProps {
  onClick?: () => void
}

export function XPChip({ onClick }: XPChipProps) {
  const [progress, setProgress] = useState({ xp: 0, level: 1, tier: 1 as XPTier })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
    
    // Send heartbeat to update streak
    fetch('/api/user/progress/heartbeat', { method: 'POST' })
      .then(() => loadProgress())
      .catch(console.error)
  }, [])

  async function loadProgress() {
    try {
      const res = await fetch('/api/user/progress')
      if (res.ok) {
        const data = await res.json()
        const level = computeLevelFromXP(data.xp)
        const tier = getTierFromLevel(level)
        setProgress({ xp: data.xp, level, tier })
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-3 py-1.5 rounded-full bg-black/50 border border-purple-500/30 animate-pulse">
        <div className="h-5 w-20 bg-slate-800 rounded" />
      </div>
    )
  }

  const progressPercent = progressToNextLevel(progress.xp)

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative px-3 py-1.5 rounded-full bg-black/50 border border-purple-500/30 hover:border-purple-500/60 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Zap className={`h-3.5 w-3.5 bg-gradient-to-br ${TIER_COLORS[progress.tier]} bg-clip-text text-transparent`} fill="currentColor" />
        <span className="text-sm font-semibold text-slate-200">{progress.xp.toLocaleString()}</span>
        <span className="text-xs text-slate-400">L{progress.level}</span>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${TIER_COLORS[progress.tier]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.button>
  )
}
