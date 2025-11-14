/**
 * SageSpace Cosmic Brand Design Tokens
 * Single source of truth for all brand values
 */

export const designTokens = {
  // Cosmic Color Palette
  colors: {
    cosmic: {
      quantumBlue: 'oklch(0.68 0.19 240)',      // #60A5FA
      nebulaPurple: 'oklch(0.68 0.17 290)',     // #A78BFA
      galacticPink: 'oklch(0.68 0.22 350)',     // #EC4899
      auroraGradient: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #EC4899 100%)',
    },
    surface: {
      cosmic900: 'oklch(0.12 0.02 265)',        // Deep space
      cosmic800: 'oklch(0.18 0.02 265)',        // Dark surface
      cosmic700: 'oklch(0.25 0.02 265)',        // Elevated surface
      cosmic600: 'oklch(0.35 0.02 265)',        // Border
    },
    glow: {
      blue: 'rgba(96, 165, 250, 0.3)',
      purple: 'rgba(167, 139, 250, 0.3)',
      pink: 'rgba(236, 72, 153, 0.3)',
    },
    semantic: {
      success: 'oklch(0.70 0.17 150)',          // Emerald
      error: 'oklch(0.62 0.24 30)',             // Red
      warning: 'oklch(0.78 0.15 90)',           // Yellow
      info: 'oklch(0.68 0.19 240)',             // Blue
    }
  },

  // Typography Scale
  typography: {
    fonts: {
      heading: 'var(--font-sans)',
      body: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },
    scale: {
      xs: '0.75rem',      // 12px - microcopy
      sm: '0.875rem',     // 14px - captions
      base: '1rem',       // 16px - body
      lg: '1.125rem',     // 18px - large body
      xl: '1.25rem',      // 20px - subheadings
      '2xl': '1.5rem',    // 24px - h3
      '3xl': '1.875rem',  // 30px - h2
      '4xl': '2.25rem',   // 36px - h1
      '5xl': '3rem',      // 48px - hero
      '6xl': '3.75rem',   // 60px - display
    },
    weight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  },

  // Spacing Scale
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
  },

  // Radii & Shadows
  radii: {
    xs: '0.25rem',    // 4px
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    cosmic: {
      blue: '0 0 20px rgba(96, 165, 250, 0.3), 0 0 40px rgba(96, 165, 250, 0.1)',
      purple: '0 0 20px rgba(167, 139, 250, 0.3), 0 0 40px rgba(167, 139, 250, 0.1)',
      pink: '0 0 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(236, 72, 153, 0.1)',
      aurora: '0 0 30px rgba(96, 165, 250, 0.2), 0 0 60px rgba(167, 139, 250, 0.15), 0 0 90px rgba(236, 72, 153, 0.1)',
    }
  },

  // Motion System
  motion: {
    duration: {
      instant: '50ms',
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
      slower: '600ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    animations: {
      fadeIn: 'fadeIn 0.5s ease-out',
      slideUp: 'slideUp 0.5s ease-out',
      slideDown: 'slideDown 0.5s ease-out',
      orbitSlow: 'orbit 20s linear infinite',
      pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      cosmicShimmer: 'cosmicShimmer 3s ease-in-out infinite',
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
} as const

export type DesignTokens = typeof designTokens
