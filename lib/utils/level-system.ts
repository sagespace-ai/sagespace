// Level system utilities for XP and progression

export function computeLevelFromXP(xp: number): number {
  // Level formula: Level = floor(sqrt(XP / 500)) + 1
  // This creates an exponential curve where each level requires more XP
  return Math.floor(Math.sqrt(xp / 500)) + 1
}

export function xpForLevel(level: number): number {
  // Inverse formula: XP needed to reach a specific level
  // XP = 500 * (level - 1)^2
  return 500 * (level - 1) * (level - 1)
}

export function xpForNextLevel(currentXP: number): number {
  const currentLevel = computeLevelFromXP(currentXP)
  return xpForLevel(currentLevel + 1)
}

export function progressToNextLevel(currentXP: number): number {
  const currentLevel = computeLevelFromXP(currentXP)
  const currentLevelXP = xpForLevel(currentLevel)
  const nextLevelXP = xpForLevel(currentLevel + 1)
  const progress = (currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)
  return Math.min(Math.max(progress, 0), 1) // Clamp between 0 and 1
}

export function xpUntilNextLevel(currentXP: number): number {
  const nextLevelXP = xpForNextLevel(currentXP)
  return Math.max(0, nextLevelXP - currentXP)
}

// XP award amounts for different actions
export const XP_REWARDS = {
  MESSAGE_SENT: 5,
  SAGE_CONVERSATION: 10,
  COUNCIL_SESSION: 25,
  ARTIFACT_CREATED: 50,
  INSIGHT_SAVED: 15,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 20, // Bonus for maintaining streak
} as const

// Tier system based on level
export function getTierFromLevel(level: number): 1 | 2 | 3 | 4 {
  if (level >= 10) return 4 // Gold tier
  if (level >= 7) return 3 // Purple tier
  if (level >= 4) return 2 // Blue tier
  return 1 // Teal tier
}

export function getTitleForLevel(level: number): string {
  const tier = getTierFromLevel(level)
  
  if (tier === 4) return 'Master Sage'
  if (tier === 3) return 'Sage Scholar'
  if (tier === 2) return 'Sage Explorer'
  return 'Sage Apprentice'
}
