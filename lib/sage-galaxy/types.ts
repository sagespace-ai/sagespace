export type SageArchetype = 'strategist' | 'dreamer' | 'warrior' | 'scholar' | 'shadowwalker'

export type TrialDifficulty = 'beginner' | 'balanced' | 'hard' | 'chaos' | 'insight'

export type TrialType = 'story' | 'daily' | 'arena' | 'mindmaze' | 'replay'

export type ConstellationDomain = 
  | 'focus'
  | 'insight'
  | 'creativity'
  | 'discipline'
  | 'emotional-intelligence'
  | 'strategy'
  | 'intuition'
  | 'shadow-work'
  | 'expression'

export interface GalaxyNode {
  id: string
  name: string
  constellation: ConstellationDomain
  type: 'trial' | 'upgrade' | 'ritual'
  x: number
  y: number
  z: number
  status: 'locked' | 'available' | 'in-progress' | 'completed' | 'perfected'
  difficulty?: TrialDifficulty
  trialType?: TrialType
  description: string
  rewards: string[]
}

export interface Constellation {
  id: ConstellationDomain
  name: string
  color: string
  glowColor: string
  nodes: GalaxyNode[]
  completionPercentage: number
}

export interface SagePlanet {
  id: string
  sageId: string
  sageName: string
  archetype: SageArchetype
  avatar: string
  evolutionStage: number
  bondLevel: number
  orbitRadius: number
  orbitSpeed: number
  currentAngle: number
  color: string
}

export interface NebulaRegion {
  id: string
  name: string
  theme: string
  color: string
  x: number
  y: number
  width: number
  height: number
  opacity: number
  isActive: boolean
  description: string
  unlockLevel?: number
}

export interface StarGate {
  id: string
  nodeId: string
  trialType: TrialType
  difficulty: TrialDifficulty
  x: number
  y: number
  isUnlocked: boolean
  pulseSpeed: number
}

export interface UserGalaxyState {
  archetype: SageArchetype
  level: number
  streak: number
  totalTrialsCompleted: number
  difficulty: TrialDifficulty
  convergenceProgress: number
  activeSages: SagePlanet[]
  unlockedRegions: string[]
}
