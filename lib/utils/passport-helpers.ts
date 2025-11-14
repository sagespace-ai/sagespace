import { computeLevelFromXP, getTitleForLevel } from './level-system'

export function awardXP(currentXP: number, amount: number): {
  newXP: number
  newLevel: number
  leveledUp: boolean
  oldLevel: number
} {
  const oldLevel = computeLevelFromXP(currentXP)
  const newXP = currentXP + amount
  const newLevel = computeLevelFromXP(newXP)
  const leveledUp = newLevel > oldLevel

  return { newXP, newLevel, leveledUp, oldLevel }
}

export function getProgressToNextLevel(xp: number): {
  currentLevel: number
  nextLevel: number
  currentLevelXP: number
  nextLevelXP: number
  progressPercent: number
  xpToNext: number
} {
  const currentLevel = computeLevelFromXP(xp)
  const nextLevel = currentLevel + 1
  
  // XP needed for current level
  const currentLevelXP = 500 * (currentLevel - 1) * (currentLevel - 1)
  // XP needed for next level
  const nextLevelXP = 500 * nextLevel * nextLevel - 500
  
  const progressInLevel = xp - currentLevelXP
  const xpNeededForLevel = nextLevelXP - currentLevelXP
  const progressPercent = Math.min(100, (progressInLevel / xpNeededForLevel) * 100)
  const xpToNext = nextLevelXP - xp

  return {
    currentLevel,
    nextLevel,
    currentLevelXP,
    nextLevelXP,
    progressPercent,
    xpToNext,
  }
}

export const FOCUS_AREAS = [
  'Product',
  'Engineering',
  'Finance',
  'Trading',
  'Research',
  'Health',
  'Spirituality',
  'Education',
  'Creative Arts',
  'Business Strategy',
] as const

export const JOURNEY_MODES = [
  'Deep Work',
  'Quick Hits',
  'Exploration',
  'Collaboration',
] as const

export const TIME_COMMITMENTS = [
  'Daily 5 min',
  'Weekly Deep Dive',
  'Ad-hoc bursts',
  'Always available',
] as const
