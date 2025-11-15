'use client'

import { motion } from 'framer-motion'
import { SageAuraProps } from '@/lib/sage-avatar/types'

export function SageAura({ theme, evolutionStage, isSpeaking, size }: SageAuraProps) {
  const auraSize = size * (0.8 + evolutionStage * 0.1)
  const intensity = theme.auraIntensity

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{
        scale: isSpeaking ? [1, 1.1, 1] : 1,
        opacity: isSpeaking ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: isSpeaking ? 1.5 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="rounded-full"
        style={{
          width: auraSize,
          height: auraSize,
          background: `radial-gradient(circle, ${theme.primaryColor}${Math.round(intensity * 30).toString(16)}, ${theme.accentColor}${Math.round(intensity * 20).toString(16)}, transparent)`,
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  )
}
