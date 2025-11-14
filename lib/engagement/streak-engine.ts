// Streak tracking and daily engagement system

export interface StreakData {
  userId: string
  currentStreak: number
  longestStreak: number
  lastActiveDate: Date
  streakStatus: 'active' | 'at-risk' | 'broken'
}

export class StreakEngine {
  async getUserStreak(userId: string): Promise<StreakData> {
    // Fetch from database
    return {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date(),
      streakStatus: 'active'
    }
  }

  async updateStreak(userId: string): Promise<StreakData> {
    const streak = await this.getUserStreak(userId)
    const today = new Date()
    const lastActive = new Date(streak.lastActiveDate)
    
    const daysSinceActive = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceActive === 0) {
      // Already active today
      return streak
    } else if (daysSinceActive === 1) {
      // Consecutive day
      streak.currentStreak++
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak)
      streak.streakStatus = 'active'
    } else {
      // Streak broken
      streak.currentStreak = 1
      streak.streakStatus = 'broken'
    }

    streak.lastActiveDate = today
    return streak
  }

  getStreakRewards(streakDays: number): { xp: number; badge?: string } {
    const milestones = [
      { days: 7, xp: 500, badge: 'week-warrior' },
      { days: 30, xp: 2000, badge: 'month-master' },
      { days: 100, xp: 10000, badge: 'century-sage' },
      { days: 365, xp: 50000, badge: 'year-legend' }
    ]

    const milestone = milestones.find(m => m.days === streakDays)
    return milestone || { xp: streakDays * 10 }
  }
}

export const streakEngine = new StreakEngine()
