"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowLeft, MessageSquare, Trophy, Map, Zap, Lock, Crown, TrendingUp, Target, Award, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { computeLevelFromXP, progressToNextLevel, xpUntilNextLevel, getTierFromLevel } from '@/lib/utils/level-system'
import type { UserProgress, Quest, Achievement } from '@/lib/types/genesis'

interface GenesisDashboardProps {
  onOpenCompanion: () => void
}

export function GenesisDashboard({ onOpenCompanion }: GenesisDashboardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [quests, setQuests] = useState<Quest[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [progressRes, profileRes, questsRes, achievementsRes] = await Promise.all([
        fetch('/api/user/progress'),
        fetch('/api/user/profile'),
        fetch('/api/genesis/quests'),
        fetch('/api/genesis/achievements'),
      ])

      if (progressRes.ok) {
        const data = await progressRes.json()
        setProgress(data)
      }

      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfile(data)
      }

      if (questsRes.ok) {
        const data = await questsRes.json()
        setQuests(data.quests || [])
      } else {
        console.log('[v0] Quests API failed, using empty array')
        setQuests([])
      }

      if (achievementsRes.ok) {
        const data = await achievementsRes.json()
        setAchievements(data.achievements || [])
      } else {
        console.log('[v0] Achievements API failed, using empty array')
        setAchievements([])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const level = computeLevelFromXP(progress.xp)
  const tier = getTierFromLevel(level)
  const progressPercent = progressToNextLevel(progress.xp) * 100
  const xpNeeded = xpUntilNextLevel(progress.xp)

  const getTierColor = (tierNum: number) => {
    if (tierNum === 1) return 'from-teal-500 to-cyan-500'
    if (tierNum === 2) return 'from-indigo-500 to-blue-500'
    if (tierNum === 3) return 'from-purple-500 to-pink-500'
    return 'from-amber-500 to-yellow-500'
  }
  
  const tierColor = getTierColor(tier)

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/demo')}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hub
          </Button>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-purple-400" />
            Genesis Chamber
          </h1>
          <p className="text-slate-400 text-lg">
            Your cosmic command center
          </p>
        </motion.div>

        {/* Identity Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border-purple-500/30 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 animate-pulse-slow" />
            
            <CardContent className="p-8 relative">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <Avatar className={`h-32 w-32 border-4 border-gradient-to-br ${tierColor} ring-4 ring-purple-500/20`}>
                    {profile?.avatar_url && <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />}
                    <AvatarFallback className="bg-purple-900 text-cyan-300 text-4xl">
                      {profile?.full_name?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-sm font-bold shadow-lg">
                    L{level}
                  </div>
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {profile?.full_name || 'Cosmic Explorer'}
                  </h2>
                  <p className="text-slate-300 mb-4">{profile?.email}</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">{progress.xp.toLocaleString()} XP</span>
                      <span className="text-sm text-slate-400">{xpNeeded.toLocaleString()} to Level {level + 1}</span>
                    </div>
                    <Progress value={progressPercent} className="h-4" />
                  </div>

                  {progress.streak_days > 0 && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30">
                      <Flame className="h-5 w-5 text-orange-400" fill="currentColor" />
                      <span className="font-semibold text-orange-300">{progress.streak_days} day streak</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={onOpenCompanion}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Chat with Origin Sage
                  </Button>
                  <Button
                    onClick={() => router.push('/playground')}
                    variant="outline"
                    className="border-purple-500/30"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Begin Journey
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Active Quests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-cyan-400" />
                  Active Quests
                </CardTitle>
                <CardDescription>Complete quests to earn XP and unlock sages</CardDescription>
              </CardHeader>
              <CardContent>
                {quests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400 mb-4">Start your journey to unlock quests!</p>
                    <Button
                      onClick={() => router.push('/playground')}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Visit Playground
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quests.filter(q => q.status === 'active').slice(0, 5).map((quest) => (
                      <div
                        key={quest.id}
                        className="p-4 rounded-lg bg-black/30 border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer"
                        onClick={() => {
                          if (quest.id === 'first-conversation' || quest.id === 'explore-playground') {
                            router.push('/playground')
                          } else if (quest.id === 'council-session') {
                            router.push('/council')
                          } else if (quest.id === 'unlock-sage') {
                            router.push('/subscriptions')
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{quest.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{quest.title}</h4>
                            <p className="text-sm text-slate-400 mb-2">{quest.description}</p>
                            <div className="flex items-center gap-2">
                              <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2 flex-1" />
                              <span className="text-xs text-slate-400">{quest.progress}/{quest.maxProgress}</span>
                            </div>
                            {quest.rewards.xp && (
                              <Badge variant="outline" className="mt-2">
                                <Zap className="h-3 w-3 mr-1" />
                                +{quest.rewards.xp} XP
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-400">Complete quests to earn achievements!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievements.slice(0, 4).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20"
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{achievement.title}</h4>
                          <p className="text-xs text-slate-400">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                    {achievements.length > 4 && (
                      <Button variant="outline" className="w-full mt-2" size="sm">
                        View All <Award className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sage Universe Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-purple-400" />
                  Your Sage Universe
                </CardTitle>
                <CardDescription>
                  {progress?.unlocked_sages?.length || 1} sages unlocked · 299 to discover
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {/* Origin Sage (always unlocked) */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative p-3 rounded-lg bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border-2 border-purple-500/50 text-center cursor-pointer"
                    onClick={() => router.push('/playground')}
                  >
                    <div className="text-3xl mb-1">✨</div>
                    <div className="text-xs text-white font-medium">Origin</div>
                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px]">Free</Badge>
                  </motion.div>

                  {/* Locked sages preview */}
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="relative p-3 rounded-lg bg-black/40 border-2 border-slate-700/50 text-center cursor-pointer"
                      onClick={() => router.push('/subscriptions')}
                    >
                      <Lock className="h-8 w-8 mx-auto mb-1 text-slate-500" />
                      <div className="text-xs text-slate-500">Locked</div>
                      <Crown className="absolute -top-2 -right-2 h-4 w-4 text-yellow-500" />
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => router.push('/subscriptions')}
                  className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Unlock Premium Sages
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total XP</span>
                    <span className="font-bold text-white">{progress.xp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Current Level</span>
                    <span className="font-bold text-white">Level {level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Streak Days</span>
                    <span className="font-bold text-orange-400">{progress.streak_days}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Longest Streak</span>
                    <span className="font-bold text-orange-400">{progress.longest_streak}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Sages Unlocked</span>
                    <span className="font-bold text-purple-400">{progress.unlocked_sages?.length || 1}/300</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
