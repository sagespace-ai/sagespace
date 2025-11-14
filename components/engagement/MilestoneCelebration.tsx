'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Trophy, Star } from 'lucide-react'

interface MilestoneProps {
  type: 'level-up' | 'skill-unlock' | 'quest-complete' | 'streak-milestone'
  title: string
  description: string
  xpGained?: number
  show: boolean
  onClose: () => void
}

export function MilestoneCelebration({ type, title, description, xpGained, show, onClose }: MilestoneProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const icons = {
    'level-up': Trophy,
    'skill-unlock': Star,
    'quest-complete': Sparkles,
    'streak-milestone': Sparkles
  }

  const Icon = icons[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-in zoom-in-50 duration-500">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 cosmic-glow">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-gray-300 mb-4">{description}</p>
            {xpGained && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-purple-300">+{xpGained} XP</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
