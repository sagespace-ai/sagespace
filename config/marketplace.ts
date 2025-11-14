export const MARKETPLACE_CATEGORIES = {
  journal: {
    label: 'Guided Journals',
    description: 'Structured journaling templates and prompts',
    icon: 'book'
  },
  'ritual-guide': {
    label: 'Ritual Guides',
    description: 'Step-by-step mindfulness and self-care practices',
    icon: 'sparkles'
  },
  'meditation-audio': {
    label: 'Meditation Audio',
    description: 'Guided meditations and soundscapes',
    icon: 'headphones'
  },
  wallpaper: {
    label: 'Cosmic Wallpapers',
    description: 'Desktop and mobile backgrounds',
    icon: 'image'
  },
  'affirmation-deck': {
    label: 'Affirmation Decks',
    description: 'Daily affirmation card collections',
    icon: 'heart'
  },
  course: {
    label: 'Mini Courses',
    description: 'Short courses on mindfulness and growth',
    icon: 'graduation-cap'
  },
  template: {
    label: 'Templates',
    description: 'Notion, Obsidian, and planning templates',
    icon: 'layout'
  }
} as const

export const MARKETPLACE_CONFIG = {
  minCommissionRate: 10.0,
  maxCommissionRate: 20.0,
  defaultCommissionRate: 15.0,
  minPrice: 0.99,
  maxFileSize: 100, // MB
  allowedFileTypes: ['pdf', 'mp3', 'png', 'jpg', 'zip', 'epub']
} as const

export const CREATOR_TIERS = {
  starter: {
    label: 'Starter',
    minSales: 0,
    commissionRate: 15.0,
    badge: 'New Creator'
  },
  established: {
    label: 'Established',
    minSales: 1000,
    commissionRate: 12.0,
    badge: 'Established Creator'
  },
  premium: {
    label: 'Premium',
    minSales: 5000,
    commissionRate: 10.0,
    badge: 'Premium Creator'
  }
} as const
