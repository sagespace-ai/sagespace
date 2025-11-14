# SageSpace Cosmic Brand System

## Brand Identity

SageSpace is a platform for multi-agent AI universes. Our brand expresses:
- **Orbiting Intelligence** - Multiple Sages working in harmony
- **Cosmic Co-evolution** - Human + AI growing together  
- **Trust & Governance** - Safe, transparent AI interactions
- **Multiverse Orchestration** - Managing complexity with elegance

## Logo System

### Primary Logo
The CosmicLogo represents orbiting Sages around a central intelligence core.

**Variants:**
- `full` - Logo + wordmark (default)
- `icon` - Logo only
- `mono` - Single color  
- `inverse` - For dark cosmic backgrounds

**Sizes:** xs, sm, md, lg, xl, 2xl

**Usage:**
\`\`\`tsx
import { CosmicLogo } from '@/components/branding/CosmicLogo'

<CosmicLogo variant="full" size="md" />
<CosmicLogoThinking size="lg" /> // Animated for AI loading states
\`\`\`

### Logo Rules
- Minimum size: 24px (xs)
- Clear space: 50% of logo height on all sides
- Never distort or rotate
- Use animated variant only for AI thinking states

## Color System

### Cosmic Palette
- **Quantum Blue:** `oklch(0.68 0.19 240)` - #60A5FA
- **Nebula Purple:** `oklch(0.68 0.17 290)` - #A78BFA  
- **Galactic Pink:** `oklch(0.68 0.22 350)` - #EC4899
- **Aurora Gradient:** Blue → Purple → Pink (135deg)

### Surface Colors
- **cosmic900:** Deep space background
- **cosmic800:** Dark surface elevation
- **cosmic700:** Elevated surface
- **cosmic600:** Border/stroke

### Semantic Colors
- **Success:** Emerald `oklch(0.70 0.17 150)`
- **Error:** Red `oklch(0.62 0.24 30)`
- **Warning:** Yellow `oklch(0.78 0.15 90)`
- **Info:** Blue `oklch(0.68 0.19 240)`

## Typography

### Font Stack
- **Headings:** Geist (sans-serif)
- **Body:** Geist  
- **Code:** Geist Mono

### Scale
- Display: 60px (--text-6xl)
- Hero: 48px (--text-5xl)
- H1: 36px (--text-4xl)
- H2: 30px (--text-3xl)
- H3: 24px (--text-2xl)
- Large Body: 18px (--text-lg)
- Body: 16px (--text-base)
- Small: 14px (--text-sm)
- Micro: 12px (--text-xs)

### Hierarchy Rules
- H1: Bold, -2% letter-spacing, text-balance
- H2/H3: Bold, -2% letter-spacing, text-pretty
- Body: Normal weight, 1.5 line-height
- All text must pass WCAG AA contrast (4.5:1)

## Spacing

Base unit: 4px (0.25rem)

- 1: 4px - Tight spacing
- 2: 8px - Compact spacing
- 3: 12px - Small gap
- 4: 16px - Default gap
- 6: 24px - Medium section
- 8: 32px - Large section
- 12: 48px - Major section
- 16: 64px - Hero spacing

## Radii & Shadows

### Radii
- xs: 4px - Tight corners
- sm: 6px - Small components  
- md: 8px - Default
- lg: 12px - Cards
- xl: 16px - Panels
- 2xl: 24px - Hero cards
- full: Circular (badges, avatars)

### Cosmic Shadows
- **Blue Glow:** `0 0 20px rgba(96,165,250,0.3)`
- **Purple Glow:** `0 0 20px rgba(167,139,250,0.3)`
- **Aurora:** Multi-color glow effect

## Motion System

### Duration
- Instant: 50ms - State changes
- Fast: 150ms - Micro-interactions
- Normal: 250ms - Default transitions
- Slow: 400ms - Emphasis
- Slower: 600ms - Orchestration

### Easing
- Default: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth ease
- In: Acceleration curves
- Out: Deceleration curves

### Animations
- `fadeIn` - Gentle appearance
- `slideUp/Down` - Directional reveals
- `orbitSlow` - 20s rotation for cosmic elements
- `pulseGlow` - 3s breathing effect
- `cosmicShimmer` - Text shimmer for emphasis

**Motion Preference:**
Always respect `prefers-reduced-motion`. Disable all animations if user prefers reduced motion.

## Components

### CosmicButton
\`\`\`tsx
<CosmicButton variant="primary" size="md" glow>
  Launch Sage
</CosmicButton>
\`\`\`

Variants: primary, secondary, ghost, outline  
Sizes: sm, md, lg

### CosmicCard
\`\`\`tsx
<CosmicCard hover glow="aurora">
  Content here
</CosmicCard>
\`\`\`

Glow options: blue, purple, pink, aurora

### CosmicChip
\`\`\`tsx
<CosmicChip variant="primary" icon={<Icon />}>
  Status
</CosmicChip>
\`\`\`

### CosmicInput
\`\`\`tsx
<CosmicInput 
  icon={<SearchIcon />} 
  placeholder="Search..." 
  error="Error message"
/>
\`\`\`

### CosmicGradientText
\`\`\`tsx
<CosmicGradientText variant="aurora" animated>
  Highlighted Text
</CosmicGradientText>
\`\`\`

### CosmicLoader
\`\`\`tsx
<CosmicLoader text="Loading Sages..." size="md" />
\`\`\`

## Layout Components

### CosmicPageLayout
Standard page wrapper with title, description, actions.

### CosmicCenteredLayout  
For auth and landing pages.

### CosmicDashboardLayout
With optional sidebar and header.

## Cosmic Background

The universal backdrop for all pages.

\`\`\`tsx
<CosmicBackground intensity="medium" interactive />
\`\`\`

**Intensity:** low (50 particles), medium (100), high (150)  
**Interactive:** Cursor-following aurora glow

## Iconography

All icons use:
- 2px stroke width
- Rounded line caps
- Cosmic gradient fills where appropriate
- Standard sizes: 16px, 20px, 24px, 32px

Domain-specific icons use semantic colors:
- Tech: Blue
- Creative: Purple  
- Business: Pink
- Science: Cyan

## Navigation

Canonical routes:
- Hub (/)
- Playground (/playground)
- Council (/council)
- Memory (/memory)
- Observatory (/observatory)
- Multiverse (/multiverse)
- Studio (/studio)
- Marketplace (/marketplace)
- Settings (/settings)

Navigation must always:
- Show active state with gradient underline
- Include XP/Level chip
- Display user avatar with dropdown
- Scale for future additions

## Accessibility

### WCAG Compliance
- All text meets AA contrast (4.5:1)
- Interactive elements meet AAA (7:1)
- Focus indicators always visible
- Skip-to-content link present
- ARIA labels on all interactive elements

### Keyboard Navigation
- Tab order logical and complete
- Escape closes modals/dropdowns
- Arrow keys navigate lists
- Enter/Space activate buttons

### Screen Readers
- Semantic HTML elements
- ARIA roles and labels
- Live regions for dynamic content
- Status announcements

## Brand Voice

**Tone:**
- Cosmic - Space and intelligence metaphors
- Wise - Thoughtful, considered guidance
- Warm - Approachable, never cold
- Clear - Technical but accessible

**Writing:**
- Use "Sage" not "AI" or "bot"
- "Journey" not "session"
- "Universe" not "workspace"
- "Deliberation" not "response"

## Don'ts

- ❌ Never use emojis in UI (only in user content)
- ❌ Never mix gradient directions inconsistently
- ❌ Never use Comic Sans or decorative fonts
- ❌ Never ignore motion preferences
- ❌ Never break semantic HTML
- ❌ Never use "Sage-O-Matic" (legacy name)
- ❌ Never use single-color gradients
- ❌ Never auto-play videos/audio
- ❌ Never trap keyboard focus

## Production Checklist

Before launch:
- [ ] All logos in place (favicon, apple-touch, og:image)
- [ ] All navigation links working
- [ ] No console errors
- [ ] Motion preferences respected
- [ ] WCAG AA compliance verified
- [ ] All pages use CosmicBackground
- [ ] Brand consistency across all routes
- [ ] Mobile responsive verified
- [ ] Loading states use CosmicLoader
- [ ] Error states use semantic colors

## Support

For brand questions: Refer to this document  
For implementation: Check `/components/cosmic/*`  
For tokens: Check `/lib/design-system/tokens.ts`
