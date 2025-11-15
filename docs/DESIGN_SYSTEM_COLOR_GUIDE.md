# Color Token Migration Guide

This document provides a quick reference for converting hardcoded Tailwind colors to semantic design tokens in SageSpace.

## Quick Reference Table

| Hardcoded Color | Semantic Token | Usage |
|----------------|----------------|-------|
| `bg-purple-500` | `bg-accent` | Cosmic accents, highlights, badges |
| `text-purple-400` | `text-accent` | Accent text color |
| `border-purple-500/50` | `border-accent/50` | Accent borders |
| `bg-blue-500` | `bg-primary` | Primary CTAs, success states |
| `text-blue-400` | `text-primary` | Primary text highlights |
| `bg-green-500` | `bg-primary` | Success messages, positive states |
| `text-green-400` | `text-primary-foreground` | Success text |
| `bg-red-500` | `bg-destructive` | Errors, warnings, delete actions |
| `text-red-400` | `text-destructive-foreground` | Error text |
| `bg-pink-500` | `bg-accent` | Secondary cosmic accents |
| `text-pink-400` | `text-accent` | Secondary accent text |
| `bg-yellow-400` | `bg-accent` | Highlights, awards, special items |
| `text-yellow-400` | `text-accent` | Highlight text |
| `bg-cyan-500` | `bg-primary` | Interactive elements, links |
| `text-cyan-400` | `text-primary` | Interactive text |

## Migration Patterns

### Before (Hardcoded)
\`\`\`tsx
<div className="bg-purple-500/20 border-purple-500/50 text-purple-300">
  <Badge className="bg-green-500 text-white">Active</Badge>
  <p className="text-red-400">Error occurred</p>
</div>
\`\`\`

### After (Semantic)
\`\`\`tsx
<div className="bg-accent/20 border-accent/50 text-accent-foreground">
  <Badge className="bg-primary text-primary-foreground">Active</Badge>
  <p className="text-destructive-foreground">Error occurred</p>
</div>
\`\`\`

## Cosmic Theme Mapping

For SageSpace's cosmic aesthetic:
- **Purple/Violet** → `accent` (main cosmic color)
- **Cyan/Blue** → `primary` (energy, action)
- **Pink** → `accent` (secondary cosmic)
- **Green** → `primary` (success, growth)
- **Red** → `destructive` (errors, warnings)
- **Yellow/Gold** → `accent` (awards, highlights)

## Benefits

1. **Automatic theme support** - Colors adapt to light/dark mode
2. **Consistency** - All components use the same color language
3. **Maintainability** - Change colors globally via design tokens
4. **Accessibility** - Semantic tokens ensure proper contrast ratios
\`\`\`
