import { Constellation, GalaxyNode, ConstellationDomain } from './types'

export const CONSTELLATION_THEMES: Record<ConstellationDomain, { name: string; color: string; glowColor: string }> = {
  'focus': { name: 'Focus Constellation', color: '#3b82f6', glowColor: '#60a5fa' },
  'insight': { name: 'Insight Constellation', color: '#8b5cf6', glowColor: '#a78bfa' },
  'creativity': { name: 'Creativity Constellation', color: '#ec4899', glowColor: '#f472b6' },
  'discipline': { name: 'Discipline Constellation', color: '#ef4444', glowColor: '#f87171' },
  'emotional-intelligence': { name: 'Emotional Intelligence', color: '#10b981', glowColor: '#34d399' },
  'strategy': { name: 'Strategy Constellation', color: '#06b6d4', glowColor: '#22d3ee' },
  'intuition': { name: 'Intuition Constellation', color: '#f59e0b', glowColor: '#fbbf24' },
  'shadow-work': { name: 'Shadow Work Constellation', color: '#6366f1', glowColor: '#818cf8' },
  'expression': { name: 'Expression Constellation', color: '#14b8a6', glowColor: '#2dd4bf' },
}

export function generateConstellationNodes(domain: ConstellationDomain, userLevel: number): GalaxyNode[] {
  const theme = CONSTELLATION_THEMES[domain]
  const nodeCount = 8
  const nodes: GalaxyNode[] = []
  
  const centerX = Math.random() * 60 + 20
  const centerY = Math.random() * 60 + 20
  const radius = 15
  
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    const z = 30 + Math.random() * 40
    
    const nodeLevel = (i + 1) * 5
    const status = nodeLevel <= userLevel 
      ? (Math.random() > 0.3 ? 'completed' : 'available')
      : 'locked'
    
    nodes.push({
      id: `${domain}-node-${i}`,
      name: `${theme.name} ${i + 1}`,
      constellation: domain,
      type: i % 3 === 0 ? 'ritual' : i % 3 === 1 ? 'upgrade' : 'trial',
      x,
      y,
      z,
      status,
      difficulty: ['beginner', 'balanced', 'hard'][i % 3] as any,
      trialType: ['story', 'daily', 'arena', 'mindmaze'][i % 4] as any,
      description: `Master ${theme.name} through focused practice`,
      rewards: ['XP +100', 'Sage Bond +10', 'Artifact Fragment']
    })
  }
  
  return nodes
}

export function generateConstellations(userLevel: number): Constellation[] {
  const domains: ConstellationDomain[] = [
    'focus', 'insight', 'creativity', 'discipline', 'emotional-intelligence',
    'strategy', 'intuition', 'shadow-work', 'expression'
  ]
  
  return domains.map(domain => {
    const theme = CONSTELLATION_THEMES[domain]
    const nodes = generateConstellationNodes(domain, userLevel)
    const completedNodes = nodes.filter(n => n.status === 'completed' || n.status === 'perfected').length
    
    return {
      id: domain,
      name: theme.name,
      color: theme.color,
      glowColor: theme.glowColor,
      nodes,
      completionPercentage: (completedNodes / nodes.length) * 100
    }
  })
}
