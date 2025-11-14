export interface GenesisUnlock {
  id: string
  name: string
  description: string
  price: number // in USD
  type: 'companion_pack' | 'achievement_pack' | 'quest_bundle' | 'sage_collection'
  icon: string
  benefits: string[]
  minTier?: 'explorer' | 'voyager' | 'astral' | 'oracle' | 'celestial'
  contents: {
    companions?: number
    achievements?: number
    quests?: number
    sages?: string[]
    bonusXP?: number
  }
}

export const GENESIS_UNLOCKS: GenesisUnlock[] = [
  // Companion Packs
  {
    id: 'companion-starter',
    name: 'Companion Starter Pack',
    description: 'Unlock 3 AI companions with unique personalities',
    price: 4.99,
    type: 'companion_pack',
    icon: '🤝',
    benefits: [
      '3 unique AI companions',
      'Personalized guidance',
      'Memory of your conversations',
      '+500 bonus XP'
    ],
    contents: {
      companions: 3,
      bonusXP: 500
    }
  },
  {
    id: 'companion-advanced',
    name: 'Advanced Companion Bundle',
    description: 'Get 10 specialized companions for every domain',
    price: 14.99,
    type: 'companion_pack',
    icon: '👥',
    benefits: [
      '10 specialized companions',
      'Domain expertise in tech, business, creative',
      'Advanced memory & context',
      '+2,000 bonus XP'
    ],
    minTier: 'voyager',
    contents: {
      companions: 10,
      bonusXP: 2000
    }
  },

  // Achievement Packs
  {
    id: 'achievements-explorer',
    name: 'Explorer Achievement Pack',
    description: 'Unlock 15 achievements to showcase your progress',
    price: 2.99,
    type: 'achievement_pack',
    icon: '🏆',
    benefits: [
      '15 unique achievements',
      'Profile badges',
      'Leaderboard eligibility',
      '+300 bonus XP'
    ],
    contents: {
      achievements: 15,
      bonusXP: 300
    }
  },
  {
    id: 'achievements-master',
    name: 'Master Achievement Collection',
    description: 'Complete set of 50 rare achievements',
    price: 9.99,
    type: 'achievement_pack',
    icon: '🌟',
    benefits: [
      '50 rare achievements',
      'Exclusive profile frames',
      'Special title: "Genesis Master"',
      '+1,500 bonus XP'
    ],
    minTier: 'astral',
    contents: {
      achievements: 50,
      bonusXP: 1500
    }
  },

  // Quest Bundles
  {
    id: 'quest-daily',
    name: 'Daily Quest Bundle',
    description: '30 days of exclusive quests with rewards',
    price: 6.99,
    type: 'quest_bundle',
    icon: '🎯',
    benefits: [
      '30 unique daily quests',
      '50-200 XP per quest',
      'Rare item rewards',
      'Streak multipliers'
    ],
    contents: {
      quests: 30,
      bonusXP: 0
    }
  },
  {
    id: 'quest-legendary',
    name: 'Legendary Quest Line',
    description: 'Epic multi-stage quest with massive rewards',
    price: 12.99,
    type: 'quest_bundle',
    icon: '⚡',
    benefits: [
      '10-stage epic quest',
      'Unlock exclusive Sages',
      '+5,000 XP on completion',
      'Legendary profile badge'
    ],
    minTier: 'oracle',
    contents: {
      quests: 10,
      bonusXP: 5000
    }
  },

  // Sage Collections
  {
    id: 'sages-tech',
    name: 'Tech Sage Collection',
    description: 'Unlock 20 technology-focused Sages',
    price: 19.99,
    type: 'sage_collection',
    icon: '💻',
    benefits: [
      '20 specialized tech Sages',
      'Coding, DevOps, AI experts',
      'Access to Tech Council',
      '+1,000 bonus XP'
    ],
    minTier: 'voyager',
    contents: {
      sages: ['tech-01', 'tech-02', 'tech-03'], // abbreviated
      bonusXP: 1000
    }
  },
  {
    id: 'sages-business',
    name: 'Business Sage Collection',
    description: 'Unlock 20 business & strategy Sages',
    price: 19.99,
    type: 'sage_collection',
    icon: '💼',
    benefits: [
      '20 business strategy Sages',
      'Marketing, finance, leadership experts',
      'Access to Business Council',
      '+1,000 bonus XP'
    ],
    minTier: 'voyager',
    contents: {
      sages: ['biz-01', 'biz-02', 'biz-03'],
      bonusXP: 1000
    }
  },
  {
    id: 'sages-complete',
    name: 'Complete Sage Universe',
    description: 'Unlock all 300 Sages instantly',
    price: 99.99,
    type: 'sage_collection',
    icon: '🌌',
    benefits: [
      'All 300 Sages unlocked',
      'Unlimited Council access',
      'Exclusive "Sage Master" title',
      '+10,000 bonus XP'
    ],
    minTier: 'celestial',
    contents: {
      sages: ['all'],
      bonusXP: 10000
    }
  }
]

export function getUnlocksByType(type: GenesisUnlock['type']) {
  return GENESIS_UNLOCKS.filter(u => u.type === type)
}

export function canPurchaseUnlock(unlock: GenesisUnlock, userTier: string): boolean {
  if (!unlock.minTier) return true
  
  const tierOrder = ['explorer', 'voyager', 'astral', 'oracle', 'celestial']
  const userTierIndex = tierOrder.indexOf(userTier)
  const requiredTierIndex = tierOrder.indexOf(unlock.minTier)
  
  return userTierIndex >= requiredTierIndex
}
