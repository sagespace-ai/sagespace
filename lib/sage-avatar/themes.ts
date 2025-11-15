import { SageArchetype, SageTheme } from './types'

export const sageThemes: Record<SageArchetype, SageTheme> = {
  strategist: {
    primaryColor: '#142A4F',
    secondaryColor: '#DDE9FF',
    accentColor: '#A7C5EA',
    runeColor: '#6B9BD1',
    particleColor: '#89B4E8',
    bodyGradient: ['#142A4F', '#1E3A5F', '#2A4A72'],
    auraIntensity: 0.7,
    movementSpeed: 1.0,
  },
  dreamer: {
    primaryColor: '#B490E6',
    secondaryColor: '#6EE7E3',
    accentColor: '#F6E18D',
    runeColor: '#D4B5F7',
    particleColor: '#9DE8E5',
    bodyGradient: ['#B490E6', '#8EC8E5', '#6EE7E3'],
    auraIntensity: 0.9,
    movementSpeed: 0.7,
  },
  warrior: {
    primaryColor: '#B4202A',
    secondaryColor: '#F8C952',
    accentColor: '#E0663D',
    runeColor: '#D64450',
    particleColor: '#F4A261',
    bodyGradient: ['#B4202A', '#D64450', '#E0663D'],
    auraIntensity: 1.0,
    movementSpeed: 1.5,
  },
  scholar: {
    primaryColor: '#0C6E5A',
    secondaryColor: '#A5ECD1',
    accentColor: '#F7E5AD',
    runeColor: '#4DA98B',
    particleColor: '#7FD4B8',
    bodyGradient: ['#0C6E5A', '#2A8572', '#4DA98B'],
    auraIntensity: 0.8,
    movementSpeed: 0.9,
  },
  shadowwalker: {
    primaryColor: '#6200A4',
    secondaryColor: '#0C0017',
    accentColor: '#9C47FF',
    runeColor: '#8030D0',
    particleColor: '#B36FFF',
    bodyGradient: ['#6200A4', '#4A0080', '#8030D0'],
    auraIntensity: 1.1,
    movementSpeed: 1.2,
  },
}

export function getSageTheme(archetype: SageArchetype): SageTheme {
  return sageThemes[archetype]
}
