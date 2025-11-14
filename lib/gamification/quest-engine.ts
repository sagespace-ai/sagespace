// SageSpace Gamification Engine - Quest System
// Manages user quests, XP progression, and Sage training workflows

export type QuestCategory = 'sage-training' | 'exploration' | 'collaboration' | 'creation' | 'mastery'
export type QuestDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type QuestStatus = 'locked' | 'available' | 'active' | 'completed'

export interface Quest {
  id: string
  title: string
  description: string
  category: QuestCategory
  difficulty: QuestDifficulty
  xpReward: number
  requiredLevel: number
  prerequisites: string[] // Quest IDs that must be completed first
  steps: QuestStep[]
  rewards: QuestReward[]
  isRepeatable: boolean
  cooldownHours?: number
}

export interface QuestStep {
  id: string
  title: string
  description: string
  completed: boolean
  requiredAction: {
    type: 'chat' | 'council' | 'train' | 'upload' | 'rate' | 'share'
    target?: string // Sage ID, topic, etc.
    count?: number
  }
}

export interface QuestReward {
  type: 'xp' | 'badge' | 'unlock' | 'cosmetic' | 'points'
  value: number | string
  name: string
}

// Predefined Quest Library
export const QUEST_LIBRARY: Quest[] = [
  {
    id: 'first-chat',
    title: 'First Contact',
    description: 'Have your first conversation with a Sage',
    category: 'exploration',
    difficulty: 'beginner',
    xpReward: 100,
    requiredLevel: 1,
    prerequisites: [],
    isRepeatable: false,
    steps: [
      {
        id: 'chat-once',
        title: 'Start a conversation',
        description: 'Send a message to any Sage in the Playground',
        completed: false,
        requiredAction: { type: 'chat', count: 1 }
      }
    ],
    rewards: [
      { type: 'xp', value: 100, name: '100 XP' },
      { type: 'badge', value: 'first-contact', name: 'First Contact Badge' }
    ]
  },
  {
    id: 'council-summon',
    title: 'Summon the Council',
    description: 'Convene a Council deliberation with multiple Sages',
    category: 'collaboration',
    difficulty: 'beginner',
    xpReward: 200,
    requiredLevel: 2,
    prerequisites: ['first-chat'],
    isRepeatable: false,
    steps: [
      {
        id: 'start-council',
        title: 'Initiate Council Session',
        description: 'Ask a complex question requiring multiple perspectives',
        completed: false,
        requiredAction: { type: 'council', count: 1 }
      }
    ],
    rewards: [
      { type: 'xp', value: 200, name: '200 XP' },
      { type: 'badge', value: 'council-caller', name: 'Council Caller Badge' }
    ]
  },
  {
    id: 'train-sage-basic',
    title: 'Teach Your Sage',
    description: 'Train a Sage by providing feedback on 5 responses',
    category: 'sage-training',
    difficulty: 'intermediate',
    xpReward: 300,
    requiredLevel: 3,
    prerequisites: ['first-chat'],
    isRepeatable: true,
    cooldownHours: 24,
    steps: [
      {
        id: 'rate-responses',
        title: 'Rate 5 Sage responses',
        description: 'Provide feedback to help your Sage improve',
        completed: false,
        requiredAction: { type: 'rate', count: 5 }
      }
    ],
    rewards: [
      { type: 'xp', value: 300, name: '300 XP' },
      { type: 'points', value: 50, name: '50 Training Points' }
    ]
  },
  {
    id: 'upload-knowledge',
    title: 'Knowledge Upload',
    description: 'Upload a document to enhance Sage expertise',
    category: 'sage-training',
    difficulty: 'intermediate',
    xpReward: 250,
    requiredLevel: 4,
    prerequisites: ['train-sage-basic'],
    isRepeatable: true,
    steps: [
      {
        id: 'upload-doc',
        title: 'Upload document',
        description: 'Share knowledge with your Sage through document upload',
        completed: false,
        requiredAction: { type: 'upload', count: 1 }
      }
    ],
    rewards: [
      { type: 'xp', value: 250, name: '250 XP' },
      { type: 'unlock', value: 'advanced-training', name: 'Advanced Training Mode' }
    ]
  },
  {
    id: 'master-sage',
    title: 'Sage Mastery',
    description: 'Train a Sage to expert level in a specific domain',
    category: 'mastery',
    difficulty: 'expert',
    xpReward: 1000,
    requiredLevel: 10,
    prerequisites: ['upload-knowledge', 'train-sage-basic'],
    isRepeatable: false,
    steps: [
      {
        id: 'train-extensive',
        title: 'Complete 20 training sessions',
        description: 'Provide comprehensive feedback and examples',
        completed: false,
        requiredAction: { type: 'train', count: 20 }
      },
      {
        id: 'upload-docs',
        title: 'Upload 5 knowledge documents',
        description: 'Build deep domain expertise',
        completed: false,
        requiredAction: { type: 'upload', count: 5 }
      }
    ],
    rewards: [
      { type: 'xp', value: 1000, name: '1000 XP' },
      { type: 'badge', value: 'sage-master', name: 'Sage Master Badge' },
      { type: 'unlock', value: 'expert-sage', name: 'Expert Sage Tier Unlock' }
    ]
  }
]

// Quest Engine Class
export class QuestEngine {
  async getUserQuests(userId: string): Promise<Quest[]> {
    // Fetch user's active and available quests from database
    // This would query passport_quests and user_quest_progress tables
    return []
  }

  async startQuest(userId: string, questId: string): Promise<boolean> {
    // Mark quest as active for user
    // Create user_quest_progress entry
    return true
  }

  async updateQuestProgress(
    userId: string, 
    questId: string, 
    action: { type: string; target?: string }
  ): Promise<{ progressMade: boolean; questCompleted: boolean; rewards?: QuestReward[] }> {
    // Check if action matches quest requirements
    // Update step completion
    // Check if all steps completed
    // Award rewards if quest complete
    return { progressMade: false, questCompleted: false }
  }

  async completeQuest(userId: string, questId: string): Promise<QuestReward[]> {
    // Mark quest as completed
    // Award XP and rewards
    // Unlock new quests if prerequisites met
    // Update user_progress table
    return []
  }

  async getAvailableQuests(userId: string, userLevel: number): Promise<Quest[]> {
    // Return quests user is eligible for based on level and prerequisites
    return QUEST_LIBRARY.filter(q => 
      q.requiredLevel <= userLevel && 
      !q.prerequisites.length // Simplified - should check completion
    )
  }
}

export const questEngine = new QuestEngine()
