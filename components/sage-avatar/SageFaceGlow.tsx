'use client'

import { motion } from 'framer-motion'
import { SageFaceGlowProps } from '@/lib/sage-avatar/types'

export function SageFaceGlow({ theme, emotion, isSpeaking, size }: SageFaceGlowProps) {
  const eyeSize = size * 0.04
  const eyeSpacing = size * 0.08
  const headY = size * 0.15

  // Emotion-based eye properties
  const emotionConfig = {
    calm: { brightness: 0.7, pulse: false, color: theme.secondaryColor },
    joy: { brightness: 1.2, pulse: true, color: theme.accentColor },
    curious: { brightness: 1.0, pulse: true, color: '#6EE7E3' },
    confident: { brightness: 1.1, pulse: false, color: theme.accentColor },
    concerned: { brightness: 0.6, pulse: false, color: theme.primaryColor },
    doubt: { brightness: 0.5, pulse: true, color: '#8B9BA8' },
    shadow: { brightness: 0.4, pulse: false, color: theme.accentColor },
  }[emotion]

  return (
    <div
      className="absolute flex gap-2 items-center justify-center"
      style={{
        left: '50%',
        top: headY,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Left eye */}
      <motion.div
        className="rounded-full"
        style={{
          width: eyeSize,
          height: eyeSize,
          background: `radial-gradient(circle, ${emotionConfig.color}, transparent)`,
          boxShadow: `0 0 ${eyeSize * 2}px ${emotionConfig.color}`,
          filter: `brightness(${emotionConfig.brightness})`,
        }}
        animate={{
          opacity: emotionConfig.pulse || isSpeaking ? [0.7, 1, 0.7] : 1,
          scale: isSpeaking ? [1, 1.3, 1] : 1,
        }}
        transition={{
          duration: isSpeaking ? 0.5 : 2,
          repeat: emotionConfig.pulse || isSpeaking ? Infinity : 0,
        }}
      />

      {/* Right eye */}
      <motion.div
        className="rounded-full"
        style={{
          width: eyeSize,
          height: eyeSize,
          background: `radial-gradient(circle, ${emotionConfig.color}, transparent)`,
          boxShadow: `0 0 ${eyeSize * 2}px ${emotionConfig.color}`,
          filter: `brightness(${emotionConfig.brightness})`,
        }}
        animate={{
          opacity: emotionConfig.pulse || isSpeaking ? [0.7, 1, 0.7] : 1,
          scale: isSpeaking ? [1, 1.3, 1] : 1,
        }}
        transition={{
          duration: isSpeaking ? 0.5 : 2,
          repeat: emotionConfig.pulse || isSpeaking ? Infinity : 0,
          delay: 0.1,
        }}
      />
    </div>
  )
}
