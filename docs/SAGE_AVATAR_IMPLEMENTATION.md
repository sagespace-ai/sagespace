# Sage Avatar Implementation Guide

This document explains how to use the Sage Avatar Component System in SageSpace.

## Quick Start

\`\`\`tsx
import { SageAvatar } from '@/components/sage-avatar';

function MyComponent() {
  return (
    <SageAvatar
      archetype="dreamer"
      evolutionStage={3}
      emotion="joy"
      size={200}
    />
  );
}
\`\`\`

## Component Architecture

The Sage Avatar is composed of layered sub-components:

1. **SageAura** - Outer glow and cosmic halo
2. **SageBase** - Body silhouette with nebula textures
3. **SageHalo** - Rotating runes around the head
4. **SageFaceGlow** - Two glowing eye points (no facial features)
5. **SageParticles** - Drifting cosmic particles

## Archetypes

Five distinct Sage personalities with unique color palettes:

- **Strategist** - Deep blues, white, silver (logic/clarity)
- **Dreamer** - Lavender, aquamarine, gold (creativity/imagination)
- **Warrior** - Crimson, gold, ember (action/confidence)
- **Scholar** - Emerald, jade, pale gold (wisdom/learning)
- **Shadowwalker** - Violet, midnight, electric purple (intuition/mystery)

## Evolution Stages

Visual complexity increases with user progression:

1. **Embers of Form** - Simple silhouette, 4 runes, low particles
2. **Awakened** - More glow, 8 runes, swirling gradients
3. **Ascendant** - Full complexity, 12 runes, strong aura
4. **Cosmic Sovereign** - Multi-layer effects, 16 runes, cosmic trails

## Emotions

Seven emotional states that affect visual behavior:

- **calm** - Gentle, slow, balanced
- **joy** - Bright pulses, upward particles
- **curious** - Aqua highlights, head tilt
- **confident** - Strong steady glow
- **concerned** - Dimmed, slow flicker
- **doubt** - Small uneven pulses
- **shadow** - Intense eyes, violet hue shifts

## Animation Timeline

Each emotion has a precise animation timeline with keyframes for:
- Eye intensity (0-1)
- Body brightness (0-1)
- Halo rotation speed (0-1)
- Particle density (0-1)

The timeline automatically loops and interpolates between keyframes.

## Interaction States

Special visual reactions to user events:

\`\`\`tsx
<SageAvatar
  archetype="warrior"
  evolutionStage={2}
  emotion="confident"
  isSpeaking={true}  // Rhythmic chest glow, faster halo
  isThinking={false} // Dim effect, rearranged runes
/>
\`\`\`

## Performance & Accessibility

The system includes built-in optimizations:

- **reduceMotion** prop respects user preferences
- Mobile automatically reduces particle counts
- CSS-based animations where possible
- GPU-accelerated transforms

## Rune System

12 unique mystical glyphs orbit the Sage's head:
- compass, spiral, eye, triad, key, flame
- wave, axis, crescent, fracture, orbit, gate

Runes are SVG paths that can be styled per archetype.

## Advanced: WebGL Nebula Shader

For premium visual fidelity, use the included GLSL shader:

\`\`\`typescript
import { nebulaVertexShader, nebulaFragmentShader } from '@/lib/sage-avatar/shaders';
\`\`\`

This creates realistic nebula textures inside the Sage body using Three.js.

## Usage Examples

### Genesis Chamber
\`\`\`tsx
<SageAvatar
  archetype={selectedArchetype}
  evolutionStage={1}
  emotion="curious"
  size={300}
/>
\`\`\`

### Council Chamber
\`\`\`tsx
{councilSages.map(sage => (
  <SageAvatar
    key={sage.id}
    archetype={sage.archetype}
    evolutionStage={sage.stage}
    emotion={sage.currentMood}
    isSpeaking={sage.isSpeaking}
    size={180}
  />
))}
\`\`\`

### Trials & Quests
\`\`\`tsx
<SageAvatar
  archetype="warrior"
  evolutionStage={userLevel}
  emotion="confident"
  isSpeaking={false}
  size={120}
/>
\`\`\`

## File Structure

\`\`\`
lib/sage-avatar/
  ├── types.ts              # TypeScript types
  ├── themes.ts             # Archetype color palettes
  ├── runes.tsx             # SVG rune symbols
  ├── emotion-timeline.ts   # Animation keyframes
  └── shaders.ts            # WebGL shaders

components/sage-avatar/
  ├── SageAvatar.tsx        # Main component
  ├── SageBase.tsx          # Body silhouette
  ├── SageHalo.tsx          # Rotating runes
  ├── SageFaceGlow.tsx      # Eye glow
  ├── SageParticles.tsx     # Particle system
  ├── SageAura.tsx          # Outer glow
  └── index.ts              # Exports

public/animations/
  └── sage-pulse.json       # Lottie animation
\`\`\`

## Next Steps

1. Replace simple `SageOrb` components with `SageAvatar`
2. Add emotion tracking to AI conversations
3. Link evolution stages to user progress system
4. Create transition animations between emotions
5. Add sound effects tied to Sage states
