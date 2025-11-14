// Motion preferences and animations

export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getAnimationDuration(baseDuration: number): number {
  return shouldReduceMotion() ? 0 : baseDuration
}

export function getTransitionClass(baseClass: string): string {
  return shouldReduceMotion() ? '' : baseClass
}

// Motion-safe animation variants for framer-motion
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: shouldReduceMotion() ? 0 : 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: shouldReduceMotion() ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion() ? 0 : 20 },
    transition: { duration: shouldReduceMotion() ? 0 : 0.4 }
  },
  scale: {
    initial: { opacity: 0, scale: shouldReduceMotion() ? 1 : 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: shouldReduceMotion() ? 1 : 0.95 },
    transition: { duration: shouldReduceMotion() ? 0 : 0.2 }
  }
}
