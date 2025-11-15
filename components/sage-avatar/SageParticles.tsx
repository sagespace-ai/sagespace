'use client'

import { motion } from 'framer-motion'
import { SageParticlesProps } from '@/lib/sage-avatar/types'
import { useMemo } from 'react'

export function SageParticles({ theme, evolutionStage, emotion, size, reduceMotion }: SageParticlesProps) {
  const particleCount = reduceMotion ? 0 : {
    1: 8,
    2: 15,
    3: 25,
    4: 40,
  }[evolutionStage]

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * size * 0.4,
      y: Math.random() * size * 0.6 + size * 0.2,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 3,
    }))
  }, [particleCount, size])

  // Emotion affects particle behavior
  const emotionSpeed = {
    calm: 0.8,
    joy: 1.5,
    curious: 1.2,
    confident: 1.0,
    concerned: 0.6,
    doubt: 0.7,
    shadow: 1.3,
  }[emotion]

  if (reduceMotion) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '50%',
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, ${theme.particleColor}, transparent)`,
            boxShadow: `0 0 ${particle.size * 2}px ${theme.particleColor}`,
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0.3,
          }}
          animate={{
            y: [particle.y, particle.y - size * 0.4],
            opacity: [0.3, 0.8, 0],
            x: [particle.x, particle.x + (Math.random() - 0.5) * 20],
          }}
          transition={{
            duration: particle.duration / emotionSpeed,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
