import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { computeLevelFromXP, getTitleForLevel } from '@/lib/utils/level-system'
import type { PassportData } from '@/lib/types/passport'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch all passport data in parallel
    const [profileRes, progressRes, achievementsRes, questsRes, activityRes, preferencesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('user_progress').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_achievements').select('achievement_key, unlocked_at').eq('user_id', user.id),
      supabase.from('user_quest_progress').select('*').eq('user_id', user.id),
      supabase.from('conversations').select('id, title, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(5),
      supabase.from('passport_preferences').select('*').eq('user_id', user.id).maybeSingle(),
    ])

    // Auto-create profile if missing
    let profile = profileRes.data
    if (!profile) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email, full_name: user.user_metadata?.full_name })
        .select()
        .single()
      profile = newProfile
    }

    // Auto-create progress if missing
    let progress = progressRes.data
    if (!progress) {
      const { data: newProgress } = await supabase
        .from('user_progress')
        .insert({ user_id: user.id, xp: 0, level: 1, streak_days: 0, longest_streak: 0 })
        .select()
        .single()
      progress = newProgress
    }

    // Get all achievements with unlock status
    const { data: allAchievements } = await supabase.from('passport_achievements').select('*')
    const unlockedKeys = new Set((achievementsRes.data || []).map(a => a.achievement_key))
    
    const achievements = (allAchievements || []).map(ach => ({
      key: ach.key,
      title: ach.title,
      description: ach.description,
      icon: ach.icon,
      category: ach.category,
      xpReward: ach.xp_reward,
      unlocked: unlockedKeys.has(ach.key),
      unlockedAt: achievementsRes.data?.find(a => a.achievement_key === ach.key)?.unlocked_at,
    }))

    // Get all quests with progress
    const { data: allQuests } = await supabase.from('passport_quests').select('*').eq('is_active', true).order('order_index')
    const questProgressMap = new Map((questsRes.data || []).map(q => [q.quest_key, q]))
    
    const quests = (allQuests || []).map(quest => {
      const progress = questProgressMap.get(quest.key)
      return {
        key: quest.key,
        title: quest.title,
        description: quest.description,
        category: quest.category,
        stepsTotal: quest.steps_total,
        stepsCompleted: progress?.steps_completed || 0,
        xpReward: quest.xp_reward,
        completed: progress?.completed || false,
        completedAt: progress?.completed_at,
      }
    })

    // Format recent activity
    const activity = (activityRes.data || []).map(conv => ({
      id: conv.id,
      type: 'conversation' as const,
      title: conv.title || 'Untitled Conversation',
      description: 'Chat session',
      icon: '💬',
      timestamp: conv.updated_at,
      link: `/playground?conversation=${conv.id}`,
    }))

    const passportData: PassportData = {
      profile: {
        userId: user.id,
        displayName: profile?.full_name,
        fullName: profile?.full_name,
        email: user.email || '',
        avatarUrl: profile?.avatar_url,
        bio: '',
        timezone: '',
        createdAt: profile?.created_at || new Date().toISOString(),
        updatedAt: profile?.updated_at || new Date().toISOString(),
      },
      progress: {
        xp: progress?.xp || 0,
        level: computeLevelFromXP(progress?.xp || 0),
        streakDays: progress?.streak_days || 0,
        longestStreak: progress?.longest_streak || 0,
        lastActive: progress?.last_active,
      },
      achievements,
      quests,
      activity,
      preferences: {
        focusAreas: preferencesRes.data?.focus_areas || [],
        journeyModes: preferencesRes.data?.journey_modes || [],
        timeCommitment: preferencesRes.data?.time_commitment,
        preferredSages: preferencesRes.data?.preferred_sages || [],
        onboardingCompleted: preferencesRes.data?.onboarding_completed || false,
      },
    }

    return NextResponse.json(passportData)
  } catch (error) {
    console.error('[API] Error in /api/passport:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
