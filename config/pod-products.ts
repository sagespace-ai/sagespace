export const POD_PRODUCT_TYPES = {
  mug: {
    label: 'Ceramic Mug',
    basePrice: 14.99,
    description: '11oz ceramic mug with cosmic design',
    icon: 'coffee'
  },
  tshirt: {
    label: 'Unisex T-Shirt',
    basePrice: 24.99,
    description: 'Soft cotton tee with premium print',
    icon: 'shirt'
  },
  poster: {
    label: 'Art Poster',
    basePrice: 19.99,
    description: '18x24" high-quality print',
    icon: 'image'
  },
  sticker: {
    label: 'Vinyl Sticker',
    basePrice: 3.99,
    description: 'Weather-resistant vinyl sticker',
    icon: 'sparkles'
  },
  hoodie: {
    label: 'Pullover Hoodie',
    basePrice: 39.99,
    description: 'Cozy fleece hoodie with cosmic design',
    icon: 'wind'
  },
  tote: {
    label: 'Tote Bag',
    basePrice: 18.99,
    description: 'Durable canvas tote with design',
    icon: 'shopping-bag'
  }
} as const

export const POD_PLATFORMS = {
  printful: {
    name: 'Printful',
    baseUrl: 'https://www.printful.com',
    commissionRate: 30
  },
  printify: {
    name: 'Printify',
    baseUrl: 'https://printify.com',
    commissionRate: 25
  },
  redbubble: {
    name: 'Redbubble',
    baseUrl: 'https://www.redbubble.com',
    commissionRate: 20
  }
} as const

export const COSMIC_THEMES = [
  'Spiral Wisdom',
  'Cosmic Panda',
  'Nebula Dreams',
  'Star Seeker',
  'Mindful Universe',
  'Galaxy Within',
  'Ethereal Journey'
] as const
