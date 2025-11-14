// Genesis Chamber type definitions

export interface UserProgress {
  user_id: string
  xp: number
  level: number
  streak_days: number
  longest_streak: number
  last_active: string
  created_at: string
  updated_at: string
  companion_unlocked: boolean
  onboarding_completed: boolean
  personality_type?: string
  sage_affinities: Record<string, number>
  unlocked_sages: string[]
}

export interface Quest {
  id: string
  title: string
  description: string
  category: 'onboarding' | 'engagement' | 'mastery' | 'special'
  progress: number
  maxProgress: number
  status: 'locked' | 'active' | 'completed' | 'claimed'
  rewards: {
    xp?: number
    sage?: string
    badge?: string
  }
  icon: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked_at?: string
  tier: 1 | 2 | 3 | 4
}

export interface CompanionMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  context_type?: string
  created_at: string
}

export interface PersonalityResult {
  type: string
  name: string
  description: string
  affinities: Record<string, number>
  recommendedSages: string[]
}
