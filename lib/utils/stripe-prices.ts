export function getStripePriceId(planId: string): string | null {
  switch (planId) {
    case 'voyager':
      return process.env.STRIPE_PRICE_VOYAGER || null
    case 'astral':
      return process.env.STRIPE_PRICE_ASTRAL || null
    case 'oracle':
      return process.env.STRIPE_PRICE_ORACLE || null
    case 'celestial':
      return process.env.STRIPE_PRICE_CELESTIAL || null
    default:
      return null
  }
}
