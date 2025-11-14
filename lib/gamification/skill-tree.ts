// Sage Skill Tree System - Orbital constellation-style progression

export type SkillCategory = 'domain' | 'communication' | 'reasoning' | 'creativity' | 'integration' | 'multimodal'

export interface SkillNode {
  id: string
  sageId: string
  category: SkillCategory
  name: string
  description: string
  level: number
  maxLevel: number
  xpRequired: number
  prerequisites: string[] // Skill IDs
  position: { x: number; y: number; z: number } // 3D orbital position
  unlocked: boolean
  benefits: SkillBenefit[]
}

export interface SkillBenefit {
  type: 'capability' | 'quality' | 'speed' | 'integration'
  description: string
  value: number
}

// Predefined skill trees for each Sage
export const SKILL_TREE_TEMPLATES: Record<string, SkillNode[]> = {
  'creative-sage': [
    {
      id: 'creative-ideation-1',
      sageId: 'creative-sage',
      category: 'creativity',
      name: 'Ideation Basics',
      description: 'Generate creative concepts and ideas',
      level: 0,
      maxLevel: 5,
      xpRequired: 100,
      prerequisites: [],
      position: { x: 0, y: 0, z: 0 }, // Center
      unlocked: true,
      benefits: [{ type: 'quality', description: '+20% idea novelty', value: 0.2 }]
    },
    {
      id: 'creative-storytelling-1',
      sageId: 'creative-sage',
      category: 'creativity',
      name: 'Narrative Craft',
      description: 'Weave compelling stories and narratives',
      level: 0,
      maxLevel: 5,
      xpRequired: 150,
      prerequisites: ['creative-ideation-1'],
      position: { x: 100, y: 50, z: 0 },
      unlocked: false,
      benefits: [{ type: 'capability', description: 'Unlock story modes', value: 1 }]
    },
    {
      id: 'creative-visual-1',
      sageId: 'creative-sage',
      category: 'multimodal',
      name: 'Visual Thinking',
      description: 'Generate visual concepts and descriptions',
      level: 0,
      maxLevel: 3,
      xpRequired: 200,
      prerequisites: ['creative-ideation-1'],
      position: { x: -100, y: 50, z: 50 },
      unlocked: false,
      benefits: [{ type: 'capability', description: 'Generate image prompts', value: 1 }]
    }
  ],
  'technical-sage': [
    {
      id: 'tech-analysis-1',
      sageId: 'technical-sage',
      category: 'reasoning',
      name: 'Code Analysis',
      description: 'Analyze and debug code efficiently',
      level: 0,
      maxLevel: 5,
      xpRequired: 100,
      prerequisites: [],
      position: { x: 0, y: 0, z: 0 },
      unlocked: true,
      benefits: [{ type: 'quality', description: '+30% bug detection', value: 0.3 }]
    },
    {
      id: 'tech-architecture-1',
      sageId: 'technical-sage',
      category: 'reasoning',
      name: 'System Design',
      description: 'Design scalable system architectures',
      level: 0,
      maxLevel: 5,
      xpRequired: 200,
      prerequisites: ['tech-analysis-1'],
      position: { x: 120, y: 0, z: 30 },
      unlocked: false,
      benefits: [{ type: 'capability', description: 'Architecture diagrams', value: 1 }]
    },
    {
      id: 'tech-integration-1',
      sageId: 'technical-sage',
      category: 'integration',
      name: 'API Integration',
      description: 'Connect and integrate external APIs',
      level: 0,
      maxLevel: 3,
      xpRequired: 150,
      prerequisites: ['tech-analysis-1'],
      position: { x: 0, y: 100, z: -30 },
      unlocked: false,
      benefits: [{ type: 'capability', description: 'API connector', value: 1 }]
    }
  ]
}

export class SkillTreeEngine {
  async getUserSageSkills(userId: string, sageId: string): Promise<SkillNode[]> {
    // Fetch user's progress for this sage's skill tree
    // Merge with template to get current state
    const template = SKILL_TREE_TEMPLATES[sageId] || []
    return template
  }

  async unlockSkill(userId: string, sageId: string, skillId: string): Promise<boolean> {
    // Check prerequisites
    // Check XP requirements
    // Unlock skill in database
    return true
  }

  async trainSkill(userId: string, sageId: string, skillId: string, xpGained: number): Promise<{
    leveledUp: boolean
    newLevel: number
    benefitsUnlocked: SkillBenefit[]
  }> {
    // Add XP to skill
    // Check for level-up
    // Return updated state
    return { leveledUp: false, newLevel: 0, benefitsUnlocked: [] }
  }

  calculateOrbitalPosition(index: number, total: number, radius: number = 150): { x: number; y: number; z: number } {
    // Distribute nodes in 3D orbital pattern
    const angle = (index / total) * Math.PI * 2
    const height = Math.sin(angle) * 50
    return {
      x: Math.cos(angle) * radius,
      y: height,
      z: Math.sin(angle) * radius * 0.5
    }
  }
}

export const skillTreeEngine = new SkillTreeEngine()
