export type Purpose = "wellness" | "creativity" | "strategy" | "research" | "general"

export type JourneyStep = "portal" | "sage-select" | "sage-chat" | "council" | "memory" | "observatory" | "multiverse"

export interface JourneyContext {
  currentStep: JourneyStep
  purpose?: Purpose
  activeSageIds: string[]
  lastArtifactId?: string
  startedAt: string
  completedSteps: JourneyStep[]
}

export interface SagePersona {
  id: string
  name: string
  description: string
  avatar?: string
  system_prompt: string
  tags: string[]
  modal_capabilities?: {
    image?: boolean
    audio?: boolean
    video?: boolean
  }
  is_premium: boolean
}

export interface Artifact {
  id: string
  user_id?: string
  type: "text" | "image" | "audio"
  title: string
  content_json: any
  created_at: string
  og_image_url?: string
  share_slug: string
  privacy: "private" | "unlisted" | "public"
}
