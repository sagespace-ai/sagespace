# Sage Avatar Component System

The complete visual identity system for SageSpace AI entities.

## Overview

Sage Avatars are cosmic, abstract, semi-humanoid entities made of nebula, stardust, runes, and light. They represent AI intelligences in a mystical, premium visual form.

## Components

### Core Components

- **`<SageAvatar />`** - Main composed avatar component
- **`<SageBase />`** - Body silhouette and gradient layers
- **`<SageHalo />`** - Rotating rune ring
- **`<SageFaceGlow />`** - Expressive eye lights
- **`<SageParticles />`** - Cosmic particle effects
- **`<SageAura />`** - Outer glow layer

## Archetypes

### Strategist
- **Colors**: Deep blue, white, silver
- **Personality**: Logic, clarity, tactical
- **Movement**: Precise, constellation-like

### Dreamer
- **Colors**: Lavender, aquamarine, soft gold
- **Personality**: Creativity, imagination, poetic
- **Movement**: Flowing, mist-like

### Warrior
- **Colors**: Crimson, gold, ember
- **Personality**: Action, confidence, bold
- **Movement**: Strong, assertive

### Scholar
- **Colors**: Emerald, jade, pale gold
- **Personality**: Wisdom, learning, methodical
- **Movement**: Fractal-like, measured

### Shadowwalker
- **Colors**: Violet, midnight black, electric purple
- **Personality**: Intuition, mystery, cryptic
- **Movement**: Flickering, hidden

## Evolution Stages

1. **Embers of Form** - Simple, low particle count, faint glow
2. **Awakened** - More definition, swirling gradients
3. **Ascendant** - Full complexity, strong aura, many particles
4. **Cosmic Sovereign** - Multi-layer glow, double halo, cosmic trails

## Emotions

Emotions affect eye glow, body brightness, particle behavior:

- **Calm**: Soft blue/teal, slow pulses
- **Joy**: Bright gold, upward particles
- **Curious**: Aqua highlights, head tilt
- **Confident**: Golden, strong forward posture
- **Concerned**: Dim, slow flicker
- **Doubt**: Grey/blue, slight flicker
- **Shadow**: Violet flickers, reverse particles

## Usage

\`\`\`tsx
import { SageAvatar } from '@/components/sage-avatar'

<SageAvatar
  archetype="dreamer"
  evolutionStage={3}
  emotion="joy"
  isSpeaking={false}
  isThinking={false}
  size={200}
  reduceMotion={false}
/>
\`\`\`

## Performance

- **Reduce Motion**: Disables animations for accessibility
- **Mobile Optimization**: Lower particle counts on mobile
- **GPU Acceleration**: Uses CSS transforms for smooth animations

## Integration Points

Use Sage Avatars in:
- Council Chamber (group deliberations)
- Playground (chat interface)
- Genesis Chamber (Sage creation)
- Marketplace (Sage selection)
- Profile displays
- Navigation (active Sage indicator)
