export type SageArchetype = 
  | 'strategist'
  | 'dreamer'
  | 'warrior'
  | 'scholar'
  | 'shadowwalker'

export type EvolutionStage = 1 | 2 | 3 | 4

export type SageEmotion =
  | 'calm'
  | 'joy'
  | 'curious'
  | 'confident'
  | 'concerned'
  | 'doubt'
  | 'shadow'

export interface SageTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  runeColor: string
  particleColor: string
  bodyGradient: string[]
  auraIntensity: number
  movementSpeed: number
}

export interface SageAvatarProps {
  archetype: SageArchetype
  evolutionStage: EvolutionStage
  emotion?: SageEmotion
  isSpeaking?: boolean
  isThinking?: boolean
  size?: number | string
  reduceMotion?: boolean
  className?: string
  onHover?: () => void
  onTap?: () => void
}

export interface SageBaseProps {
  theme: SageTheme
  evolutionStage: EvolutionStage
  emotion: SageEmotion
  isSpeaking: boolean
  size: number
  reduceMotion: boolean
}

export interface SageHaloProps {
  theme: SageTheme
  evolutionStage: EvolutionStage
  isSpeaking: boolean
  isThinking: boolean
  size: number
  reduceMotion: boolean
}

export interface SageFaceGlowProps {
  theme: SageTheme
  emotion: SageEmotion
  isSpeaking: boolean
  size: number
}

export interface SageParticlesProps {
  theme: SageTheme
  evolutionStage: EvolutionStage
  emotion: SageEmotion
  size: number
  reduceMotion: boolean
}

export interface SageAuraProps {
  theme: SageTheme
  evolutionStage: EvolutionStage
  isSpeaking: boolean
  size: number
}
