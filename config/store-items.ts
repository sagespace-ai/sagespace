export interface StoreItem {
  id: string;
  type: 'XP_PACK' | 'SAGEPOINTS_PACK' | 'BOOST';
  name: string;
  description: string;
  priceCents: number;
  value: number; // XP amount or SagePoints amount
  bonus?: number; // Bonus percentage for bulk purchases
  popular?: boolean;
}

export const XP_PACKS: StoreItem[] = [
  {
    id: 'xp_500',
    type: 'XP_PACK',
    name: 'Spark',
    description: '500 XP instant boost',
    priceCents: 199,
    value: 500,
  },
  {
    id: 'xp_1000',
    type: 'XP_PACK',
    name: 'Flash',
    description: '1,000 XP + 10% bonus',
    priceCents: 349,
    value: 1000,
    bonus: 10,
    popular: true,
  },
  {
    id: 'xp_2500',
    type: 'XP_PACK',
    name: 'Surge',
    description: '2,500 XP + 15% bonus',
    priceCents: 799,
    value: 2500,
    bonus: 15,
  },
  {
    id: 'xp_5000',
    type: 'XP_PACK',
    name: 'Supernova',
    description: '5,000 XP + 25% bonus',
    priceCents: 1499,
    value: 5000,
    bonus: 25,
  },
];

export const SAGEPOINTS_PACKS: StoreItem[] = [
  {
    id: 'sagepoints_10',
    type: 'SAGEPOINTS_PACK',
    name: 'Insight Pack',
    description: '10 SagePoints for premium Council sessions',
    priceCents: 499,
    value: 10,
  },
  {
    id: 'sagepoints_25',
    type: 'SAGEPOINTS_PACK',
    name: 'Wisdom Pack',
    description: '25 SagePoints + 5 bonus',
    priceCents: 999,
    value: 25,
    bonus: 20,
    popular: true,
  },
  {
    id: 'sagepoints_50',
    type: 'SAGEPOINTS_PACK',
    name: 'Oracle Pack',
    description: '50 SagePoints + 15 bonus',
    priceCents: 1799,
    value: 50,
    bonus: 30,
  },
];

// Legacy export name for backward compatibility during migration
export const COUNCIL_PACKS = SAGEPOINTS_PACKS;
