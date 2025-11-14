export interface AffiliatePartner {
  id: string
  name: string
  category: 'wellness' | 'courses' | 'storage' | 'books' | 'music'
  logo?: string
  description: string
  disclosureText: string
}

export interface AffiliateProduct {
  id: string
  partnerId: string
  name: string
  description: string
  category: string
  affiliateUrl: string
  priceUsd: number
  imageUrl?: string
  tags: string[]
  isFeatured: boolean
}

export const AFFILIATE_CATEGORIES = {
  wellness: {
    label: 'Wellness & Mindfulness',
    description: 'Apps and services for meditation, sleep, and mental health',
    icon: 'heart'
  },
  courses: {
    label: 'Learning & Growth',
    description: 'Online courses and educational platforms',
    icon: 'book-open'
  },
  storage: {
    label: 'Cloud Storage',
    description: 'Secure storage for your memories and files',
    icon: 'cloud'
  },
  books: {
    label: 'Books & Audio',
    description: 'Physical books, ebooks, and audiobooks',
    icon: 'book'
  },
  music: {
    label: 'Music & Audio',
    description: 'Streaming services and audio platforms',
    icon: 'music'
  }
} as const

export const FTC_DISCLOSURE = `
**Affiliate Disclosure**: SageSpace participates in affiliate programs. When you purchase through our links, we may earn a commission at no additional cost to you. This helps us keep SageSpace running and improve our services. We only recommend products we believe will genuinely benefit our community.
`
