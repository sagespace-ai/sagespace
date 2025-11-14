export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  tier: string | null;
  isPremium: boolean;
  priceCents: number;
  config: {
    background: string;
    text: string;
    accent: string;
    logoVariant: string;
  };
  previewImage?: string;
}

export const THEME_CATALOG: ThemeConfig[] = [
  {
    id: 'default_cosmic',
    name: 'Cosmic Night',
    description: 'The classic SageSpace experience with deep cosmic vibes',
    tier: null,
    isPremium: false,
    priceCents: 0,
    config: {
      background: 'from-slate-950 via-purple-950 to-slate-900',
      text: 'text-white',
      accent: 'from-cyan-400 via-purple-400 to-pink-400',
      logoVariant: 'spiral_default',
    },
  },
  {
    id: 'nebula_dream',
    name: 'Nebula Dream',
    description: 'Soft purples and blues like floating through stardust',
    tier: 'voyager',
    isPremium: true,
    priceCents: 500,
    config: {
      background: 'from-indigo-950 via-purple-900 to-blue-950',
      text: 'text-white',
      accent: 'from-blue-400 via-indigo-400 to-purple-400',
      logoVariant: 'spiral_nebula',
    },
  },
  {
    id: 'aurora_frost',
    name: 'Aurora Frost',
    description: 'Cool cyan and green northern lights',
    tier: 'voyager',
    isPremium: true,
    priceCents: 500,
    config: {
      background: 'from-slate-950 via-teal-950 to-emerald-950',
      text: 'text-white',
      accent: 'from-cyan-300 via-teal-300 to-emerald-300',
      logoVariant: 'spiral_aurora',
    },
  },
  {
    id: 'solar_flare',
    name: 'Solar Flare',
    description: 'Warm golds and oranges like a cosmic sunrise',
    tier: 'astral',
    isPremium: true,
    priceCents: 900,
    config: {
      background: 'from-slate-950 via-amber-950 to-orange-950',
      text: 'text-white',
      accent: 'from-amber-400 via-orange-400 to-red-400',
      logoVariant: 'spiral_solar',
    },
  },
  {
    id: 'void_obsidian',
    name: 'Void Obsidian',
    description: 'Ultra-minimal black with subtle purple hints',
    tier: 'astral',
    isPremium: true,
    priceCents: 900,
    config: {
      background: 'from-black via-slate-950 to-black',
      text: 'text-slate-200',
      accent: 'from-purple-500 to-violet-500',
      logoVariant: 'spiral_void',
    },
  },
  {
    id: 'celestial_gold',
    name: 'Celestial Gold',
    description: 'Premium gold and violet for the elite',
    tier: 'celestial',
    isPremium: true,
    priceCents: 1900,
    config: {
      background: 'from-slate-950 via-violet-950 to-purple-950',
      text: 'text-white',
      accent: 'from-yellow-400 via-amber-400 to-orange-400',
      logoVariant: 'spiral_gold',
    },
  },
];
