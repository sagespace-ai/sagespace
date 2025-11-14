export interface PassportProfile {
  userId: string
  displayName?: string
  fullName?: string
  email: string
  avatarUrl?: string
  bio?: string
  timezone?: string
  createdAt: string
  updatedAt: string
}

export interface PassportProgress {
  xp: number
  level: number
  streakDays: number
  longestStreak: number
  lastActive?: string
}

export interface PassportAchievement {
  key: string
  title: string
  description: string
  icon?: string
  category: string
  xpReward: number
  unlocked?: boolean
  unlockedAt?: string
}

export interface PassportQuest {
  key: string
  title: string
  description: string
  category: string
  stepsTotal: number
  stepsCompleted: number
  xpReward: number
  completed: boolean
  completedAt?: string
}

export interface PassportPreferences {
  focusAreas: string[]
  journeyModes: string[]
  timeCommitment?: string
  preferredSages: string[]
  onboardingCompleted: boolean
}

export interface PassportActivity {
  id: string
  type: 'conversation' | 'visit' | 'creation'
  title: string
  description: string
  icon: string
  timestamp: string
  link?: string
}

export interface PassportData {
  profile: PassportProfile
  progress: PassportProgress
  achievements: PassportAchievement[]
  quests: PassportQuest[]
  activity: PassportActivity[]
  preferences: PassportPreferences
}
