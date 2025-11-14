// Streak calculation and management

export function updateStreak(lastActiveDate: Date, streakDays: number, longestStreak: number): {
  newStreak: number
  longestStreak: number
  earnedBonus: boolean
} {
  const now = new Date()
  const lastActive = new Date(lastActiveDate)
  
  // Reset time components for date comparison
  now.setHours(0, 0, 0, 0)
  lastActive.setHours(0, 0, 0, 0)
  
  const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
  
  let newStreak = streakDays
  let earnedBonus = false
  
  if (daysDiff === 0) {
    // Same day, no change
    return { newStreak: streakDays, longestStreak, earnedBonus: false }
  } else if (daysDiff === 1) {
    // Consecutive day, increment streak
    newStreak = streakDays + 1
    earnedBonus = true
  } else if (daysDiff > 1) {
    // Missed days, reset streak
    newStreak = 1
    earnedBonus = false
  }
  
  // Update longest streak if necessary
  const newLongestStreak = Math.max(longestStreak, newStreak)
  
  return {
    newStreak,
    longestStreak: newLongestStreak,
    earnedBonus
  }
}

export function getStreakEmoji(streakDays: number): string {
  if (streakDays >= 30) return '🔥'
  if (streakDays >= 14) return '⚡'
  if (streakDays >= 7) return '✨'
  if (streakDays >= 3) return '💫'
  return '🌟'
}
