# SageSpace 3D Cosmic UI System

## Overview

SageSpace features a cosmic 3D visual language that creates depth, motion, and engagement through carefully crafted animations and effects.

## Core Principles

1. **Depth Through Layers** - Multiple z-index planes create perceived depth
2. **Orbital Motion** - Elements move in gentle circular patterns
3. **Glow & Bloom** - Soft glows create a nebula-like atmosphere
4. **Responsive 3D** - Cards tilt based on mouse position

## Components

### CosmicParticles
Canvas-based particle system with 3D star field effect.

Usage:
\`\`\`tsx
<CosmicParticles intensity={100} />
\`\`\`

### Cosmic3DCard
Interactive card with tilt-on-hover 3D effect.

Usage:
\`\`\`tsx
<Cosmic3DCard glowColor="purple">
  <YourContent />
</Cosmic3DCard>
\`\`\`

## CSS Classes

### Animations
- `.cosmic-float` - Gentle floating motion
- `.cosmic-orbit` - Circular orbital rotation
- `.cosmic-glow` - Pulsing glow effect
- `.cosmic-shimmer` - Gradient shimmer animation

### Backgrounds
- `.bg-nebula-blue` - Blue nebula gradient
- `.bg-nebula-purple` - Purple nebula gradient
- `.bg-nebula-pink` - Pink nebula gradient

### 3D Effects
- `.cosmic-glass` - Glass morphism with glow
- `.transform-3d` - Enable 3D transforms
- `.layer-front/middle/back` - Depth layering

## Performance Notes

- Particle count: Default 100, adjustable based on device
- Respects `prefers-reduced-motion`
- Uses `requestAnimationFrame` for smooth 60fps
- Hardware-accelerated transforms

## Future Enhancements

- Three.js integration for full 3D skill trees
- WebGL shader effects for advanced visuals
- Rive animations for Sage characters
- Lottie micro-animations for UI feedback
