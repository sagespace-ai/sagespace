'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Map, Edit } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { PassportProfile, PassportProgress } from '@/lib/types/passport'
import { getProgressToNextLevel } from '@/lib/utils/passport-helpers'
import { getTitleForLevel } from '@/lib/utils/level-system'
import Link from 'next/link'

interface Props {
  profile: PassportProfile
  progress: PassportProgress
  onBeginJourney: () => void
  onRefresh: () => void
}

export function IdentityHeader({ profile, progress, onBeginJourney, onRefresh }: Props) {
  const progressInfo = getProgressToNextLevel(progress.xp)
  const title = getTitleForLevel(progress.level)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-cyan-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar with level badge */}
          <div className="relative">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-cyan-500/30">
              <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-3xl">
                {profile.displayName?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold">
              L{progress.level}
            </Badge>
          </div>

          {/* Identity & Progress */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {profile.displayName || 'Anonymous Explorer'}
                </h1>
                <p className="text-cyan-400 font-medium">{title}</p>
                <p className="text-sm text-gray-400">{profile.email}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={onRefresh}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {progress.xp.toLocaleString()} / {progressInfo.nextLevelXP.toLocaleString()} XP
                </span>
                <span className="text-cyan-400 font-medium">
                  {progressInfo.xpToNext.toLocaleString()} XP to Level {progressInfo.nextLevel}
                </span>
              </div>
              <Progress value={progressInfo.progressPercent} className="h-3" />
            </div>

            {/* Streak Badge */}
            {progress.streakDays > 0 && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                🔥 {progress.streakDays} day streak
              </Badge>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                onClick={onBeginJourney}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Begin Journey
              </Button>
              <Button variant="outline" asChild>
                <Link href="/universe-map">
                  <Map className="h-4 w-4 mr-2" />
                  View Universe Map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
