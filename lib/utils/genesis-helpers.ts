// Genesis Chamber helper utilities

import { Quest, Achievement } from '@/lib/types/genesis'

// Predefined quest catalog
export const QUEST_CATALOG: Quest[] = [
  {
    id: 'complete-onboarding',
    title: 'Awaken Your Cosmic Identity',
    description: 'Complete the personality assessment with Origin Sage',
    category: 'onboarding',
    progress: 0,
    maxProgress: 1,
    status: 'active',
    rewards: { xp: 100, badge: 'awakened' },
    icon: '✨',
  },
  {
    id: 'first-conversation',
    title: 'Begin Your First Journey',
    description: 'Start a conversation with any sage',
    category: 'onboarding',
    progress: 0,
    maxProgress: 1,
    status: 'active',
    rewards: { xp: 50 },
    icon: '💬',
  },
  {
    id: 'unlock-first-premium',
    title: 'Expand Your Universe',
    description: 'Unlock your first premium sage',
    category: 'engagement',
    progress: 0,
    maxProgress: 1,
    status: 'locked',
    rewards: { xp: 200 },
    icon: '🔓',
  },
  {
    id: 'seven-day-streak',
    title: 'Consistency Master',
    description: 'Maintain a 7-day login streak',
    category: 'engagement',
    progress: 0,
    maxProgress: 7,
    status: 'active',
    rewards: { xp: 150, badge: 'consistent' },
    icon: '🔥',
  },
  {
    id: 'council-session',
    title: 'Assemble the Council',
    description: 'Start your first multi-sage deliberation',
    category: 'mastery',
    progress: 0,
    maxProgress: 1,
    status: 'active',
    rewards: { xp: 100 },
    icon: '⚖️',
  },
  {
    id: 'reach-level-5',
    title: 'Rising Star',
    description: 'Reach level 5',
    category: 'mastery',
    progress: 0,
    maxProgress: 5,
    status: 'active',
    rewards: { xp: 250, sage: 'mystery-sage-1' },
    icon: '⭐',
  },
]

// Predefined achievement catalog
export const ACHIEVEMENT_CATALOG: Achievement[] = [
  {
    id: 'awakened',
    title: 'Awakened',
    description: 'Completed cosmic identity assessment',
    icon: '✨',
    tier: 1,
  },
  {
    id: 'consistent',
    title: 'Consistency Champion',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    tier: 2,
  },
  {
    id: 'first-unlock',
    title: 'Universe Expander',
    description: 'Unlocked your first premium sage',
    icon: '🌌',
    tier: 2,
  },
  {
    id: 'council-master',
    title: 'Council Master',
    description: 'Hosted 10 council sessions',
    icon: '⚖️',
    tier: 3,
  },
  {
    id: 'level-10',
    title: 'Sage Scholar',
    description: 'Reached level 10',
    icon: '📚',
    tier: 4,
  },
]

// Personality assessment questions
export const PERSONALITY_QUESTIONS = [
  {
    id: 'thinking-style',
    question: 'When solving problems, you prefer to:',
    options: [
      { id: 'analytical', label: 'Analyze data and facts systematically', domains: ['tech', 'science', 'finance'] },
      { id: 'creative', label: 'Explore creative and unconventional solutions', domains: ['creative', 'design', 'art'] },
      { id: 'practical', label: 'Focus on practical, actionable steps', domains: ['business', 'productivity', 'health'] },
      { id: 'empathetic', label: 'Consider emotional and human impacts', domains: ['relationships', 'wellness', 'psychology'] },
    ],
  },
  {
    id: 'learning-preference',
    question: 'You learn best through:',
    options: [
      { id: 'doing', label: 'Hands-on practice and experimentation', domains: ['tech', 'creative', 'science'] },
      { id: 'discussing', label: 'Conversations and collaborative exploration', domains: ['business', 'relationships', 'education'] },
      { id: 'reading', label: 'Deep reading and research', domains: ['academic', 'writing', 'philosophy'] },
      { id: 'visualizing', label: 'Visual diagrams and demonstrations', domains: ['design', 'art', 'science'] },
    ],
  },
  {
    id: 'goal-focus',
    question: 'Your primary goals involve:',
    options: [
      { id: 'career', label: 'Career advancement and professional growth', domains: ['business', 'finance', 'career'] },
      { id: 'creative', label: 'Creative expression and artistic pursuits', domains: ['creative', 'art', 'design', 'writing'] },
      { id: 'knowledge', label: 'Expanding knowledge and understanding', domains: ['academic', 'science', 'philosophy'] },
      { id: 'wellness', label: 'Personal wellbeing and relationships', domains: ['health', 'relationships', 'wellness'] },
    ],
  },
  {
    id: 'work-style',
    question: 'You work best when:',
    options: [
      { id: 'structured', label: 'Following clear structures and systems', domains: ['productivity', 'business', 'finance'] },
      { id: 'flexible', label: 'Having creative freedom and flexibility', domains: ['creative', 'art', 'design'] },
      { id: 'collaborative', label: 'Working with others and sharing ideas', domains: ['relationships', 'education', 'business'] },
      { id: 'independent', label: 'Working independently and self-directed', domains: ['tech', 'writing', 'science'] },
    ],
  },
]

// Calculate personality type and affinities
export function calculatePersonality(answers: Record<string, string>): {
  type: string
  affinities: Record<string, number>
} {
  const domainScores: Record<string, number> = {}
  
  PERSONALITY_QUESTIONS.forEach(q => {
    const answer = answers[q.id]
    if (answer) {
      const option = q.options.find(opt => opt.id === answer)
      if (option) {
        option.domains.forEach(domain => {
          domainScores[domain] = (domainScores[domain] || 0) + 1
        })
      }
    }
  })
  
  // Determine primary type based on top scoring domains
  const sortedDomains = Object.entries(domainScores)
    .sort(([, a], [, b]) => b - a)
  
  const primaryDomain = sortedDomains[0]?.[0] || 'general'
  
  // Normalize affinities to 0-1 scale
  const maxScore = Math.max(...Object.values(domainScores))
  const affinities: Record<string, number> = {}
  Object.entries(domainScores).forEach(([domain, score]) => {
    affinities[domain] = score / maxScore
  })
  
  return {
    type: primaryDomain,
    affinities,
  }
}
