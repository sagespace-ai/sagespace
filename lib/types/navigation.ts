export type SystemStatus = "ok" | "active_session" | "recommendation" | "xp_drop" | "error"
export type XPTier = 1 | 2 | 3 | 4

export interface NavigationState {
  activeSage?: {
    id: string
    name: string
    avatar: string
  }
  activeMode: string
  sessionActive: boolean
  systemStatus: SystemStatus
  notifications: number
  insights: number
  audioActive: boolean
}

export interface UserStats {
  xp: number
  level: number
  streak: number
  tier: XPTier
  initials: string
  avatarUrl?: string
}
