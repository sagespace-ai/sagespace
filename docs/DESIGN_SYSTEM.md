# SageSpace Design System

## Semantic Color Tokens

SageSpace uses a semantic color token system that supports automatic theming and maintains visual consistency across the platform.

### Core Tokens

- **Background & Foreground**
  - `bg-background` - Main background color
  - `text-foreground` - Main text color
  - `bg-card` - Card/surface background
  - `text-card-foreground` - Card text color

- **Interactive Elements**
  - `bg-primary` - Primary actions (CTAs, submit buttons)
  - `text-primary-foreground` - Text on primary elements
  - `bg-secondary` - Secondary actions
  - `text-secondary-foreground` - Text on secondary elements

- **Accents & Highlights**
  - `bg-accent` - Accent color for highlights, badges, special UI
  - `text-accent` - Accent text color
  - `text-accent-foreground` - Text on accent backgrounds

- **Status & Feedback**
  - `bg-destructive` - Error states, warnings, delete actions
  - `text-destructive-foreground` - Text on destructive elements
  - `bg-muted` - Subtle, muted elements
  - `text-muted-foreground` - Secondary text

- **Borders & Rings**
  - `border-border` - Standard borders
  - `ring-ring` - Focus ring color
  - `bg-input` - Input backgrounds

### Usage Guidelines

**DO:**
- Use semantic tokens for all UI elements
- Use `bg-accent` for purple/pink cosmic highlights
- Use `bg-primary` for green success states
- Use `bg-destructive` for red error states
- Apply opacity modifiers: `bg-accent/20`, `border-accent/50`

**DON'T:**
- Use hardcoded colors like `bg-blue-500` or `text-purple-400`
- Use hex colors or RGB values in Tailwind classes
- Mix semantic and hardcoded colors in the same component

### Chart Colors

For data visualization:
- `bg-chart-1`, `bg-chart-2`, `bg-chart-3`, `bg-chart-4`, `bg-chart-5`

### Cosmic UI Classes

Pre-built cosmic classes that use semantic tokens:
- `.cosmic-card` - Card with accent borders
- `.cosmic-button-primary` - Primary gradient button
- `.cosmic-button-secondary` - Secondary gradient button
- `.cosmic-text-gradient` - Gradient text effect
- `.cosmic-badge-primary` - Primary badge style
- `.cosmic-badge-secondary` - Secondary badge style
- `.cosmic-success` - Success state styling
- `.cosmic-error` - Error state styling
- `.cosmic-warning` - Warning state styling

### Migration Guide

Replace hardcoded colors with semantic equivalents:

| Old (Hardcoded) | New (Semantic) | Use Case |
|----------------|----------------|----------|
| `bg-purple-500` | `bg-accent` | Accents, highlights |
| `text-purple-400` | `text-accent` | Accent text |
| `bg-blue-500` | `bg-primary` | Primary actions |
| `text-blue-400` | `text-primary` | Primary text |
| `bg-green-500` | `bg-primary` | Success states |
| `text-green-400` | `text-primary-foreground` | Success text |
| `bg-red-500` | `bg-destructive` | Errors, warnings |
| `text-red-400` | `text-destructive-foreground` | Error text |
| `bg-yellow-400` | `bg-accent` | Highlights, badges |
| `text-yellow-400` | `text-accent` | Highlight text |
| `bg-pink-500` | `bg-accent` | Secondary accents |
| `text-pink-400` | `text-accent` | Secondary accent text |

### Examples

\`\`\`tsx
// ❌ Bad - Hardcoded colors
<div className="bg-purple-500/20 border-purple-500/50 text-purple-300">
  <Badge className="bg-green-500 text-white">Active</Badge>
</div>

// ✅ Good - Semantic tokens
<div className="bg-accent/20 border-accent/50 text-accent-foreground">
  <Badge className="bg-primary text-primary-foreground">Active</Badge>
</div>
\`\`\`

### Theme Support

All semantic tokens automatically adapt to light/dark mode and custom themes defined in `app/globals.css`.
