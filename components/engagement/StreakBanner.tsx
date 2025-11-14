'use client'

import { useState, useEffect } from 'react'
import { Flame, Award } from 'lucide-react'

export default function StreakBanner() {
  const [streak, setStreak] = useState<any>(null)

  useEffect(() => {
    fetchStreak()
  }, [])

  const fetchStreak = async () => {
    try {
      const response = await fetch('/api/engagement/streak')
      const data = await response.json()
      setStreak(data.streak)
    } catch (error) {
      console.error('[v0] Error fetching streak:', error)
    }
  }

  if (!streak || streak.currentStreak === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
          <div>
            <div className="font-bold text-white">{streak.currentStreak} Day Streak!</div>
            <div className="text-xs text-gray-300">Keep it going!</div>
          </div>
          {streak.currentStreak >= streak.longestStreak && (
            <Award className="w-5 h-5 text-yellow-400" />
          )}
        </div>
      </div>
    </div>
  )
}
