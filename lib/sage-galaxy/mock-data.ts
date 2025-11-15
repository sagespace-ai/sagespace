import { SagePlanet, NebulaRegion, UserGalaxyState } from './types'

export function generateMockSagePlanets(): SagePlanet[] {
  const archetypes = ['strategist', 'dreamer', 'warrior', 'scholar', 'shadowwalker'] as const
  const colors = ['#3b82f6', '#a78bfa', '#ef4444', '#10b981', '#8b5cf6']
  
  return archetypes.map((archetype, i) => ({
    id: `sage-planet-${i}`,
    sageId: `sage-${archetype}`,
    sageName: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Sage`,
    archetype,
    avatar: ['🧙‍♂️', '🧙‍♀️', '⚔️', '📚', '🌑'][i],
    evolutionStage: Math.floor(Math.random() * 3) + 1,
    bondLevel: Math.floor(Math.random() * 100),
    orbitRadius: 120 + i * 40,
    orbitSpeed: 0.0003 + i * 0.0001,
    currentAngle: (i / archetypes.length) * Math.PI * 2,
    color: colors[i]
  }))
}

export function generateMockNebulaRegions(): NebulaRegion[] {
  return [
    {
      id: 'nebula-1',
      name: 'Eclipse Rift',
      theme: 'Limited Event',
      color: '#ec4899',
      x: 70,
      y: 20,
      width: 25,
      height: 20,
      opacity: 0.3,
      isActive: true,
      description: 'A limited-time cosmic event with special rewards',
    },
    {
      id: 'nebula-2',
      name: 'Dreamer\'s Mist Belt',
      theme: 'Creativity Zone',
      color: '#a78bfa',
      x: 15,
      y: 60,
      width: 20,
      height: 25,
      opacity: 0.25,
      isActive: true,
      description: 'Enhance your creative powers in this mystic region',
    },
    {
      id: 'nebula-3',
      name: 'Shadow Corridor',
      theme: 'Advanced Shadow Work',
      color: '#6366f1',
      x: 75,
      y: 70,
      width: 18,
      height: 22,
      opacity: 0.2,
      isActive: false,
      description: 'Unlock at level 50 to explore the depths of shadow work',
      unlockLevel: 50,
    },
  ]
}

export function getMockUserGalaxyState(userLevel: number = 25): UserGalaxyState {
  return {
    archetype: 'strategist',
    level: userLevel,
    streak: 12,
    totalTrialsCompleted: 145,
    difficulty: 'balanced',
    convergenceProgress: 62,
    activeSages: generateMockSagePlanets(),
    unlockedRegions: ['nebula-1', 'nebula-2']
  }
}
