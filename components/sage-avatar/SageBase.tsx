'use client'

import { motion } from 'framer-motion'
import { SageBaseProps } from '@/lib/sage-avatar/types'

export function SageBase({ theme, evolutionStage, emotion, isSpeaking, size, reduceMotion }: SageBaseProps) {
  const baseOpacity = evolutionStage * 0.2 + 0.2 // 0.4 to 1.0
  const glowIntensity = isSpeaking ? 1.2 : 1.0
  
  // Emotion-based adjustments
  const emotionBrightness = {
    calm: 0.8,
    joy: 1.2,
    curious: 1.0,
    confident: 1.1,
    concerned: 0.7,
    doubt: 0.6,
    shadow: 0.5,
  }[emotion]

  const breathingScale = reduceMotion ? 1 : [1, 1.02, 1]
  const breathingDuration = 3

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{
        scale: breathingScale,
      }}
      transition={{
        duration: breathingDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ width: size, height: size }}
    >
      {/* Main silhouette */}
      <div
        className="relative"
        style={{
          width: size * 0.5,
          height: size * 0.7,
          opacity: baseOpacity * emotionBrightness,
        }}
      >
        {/* Body gradient layers */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.bodyGradient[0]}${Math.round(glowIntensity * 90).toString(16)}, ${theme.bodyGradient[1]}${Math.round(glowIntensity * 60).toString(16)}, transparent)`,
            filter: `brightness(${emotionBrightness})`,
          }}
        />
        
        {/* Nebula texture layer */}
        <motion.div
          className="absolute inset-0"
          animate={reduceMotion ? {} : {
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${theme.bodyGradient[1]}40, transparent 50%),
                        radial-gradient(circle at 70% 70%, ${theme.bodyGradient[2]}30, transparent 60%)`,
            backgroundSize: '200% 200%',
            mixBlendMode: 'screen',
          }}
        />

        {/* Silhouette shape - robe-like form */}
        <svg
          viewBox="0 0 100 140"
          className="absolute inset-0 w-full h-full"
          style={{ filter: `drop-shadow(0 0 ${size * 0.05}px ${theme.primaryColor})` }}
        >
          {/* Head */}
          <ellipse
            cx="50"
            cy="20"
            rx="15"
            ry="18"
            fill={theme.primaryColor}
            opacity={baseOpacity}
          />
          
          {/* Body/robe */}
          <path
            d="M 35 30 Q 30 50, 20 80 Q 15 100, 25 130 L 40 140 L 60 140 L 75 130 Q 85 100, 80 80 Q 70 50, 65 30 Z"
            fill="url(#bodyGradient)"
            opacity={baseOpacity}
          />
          
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.bodyGradient[0]} stopOpacity={baseOpacity} />
              <stop offset="50%" stopColor={theme.bodyGradient[1]} stopOpacity={baseOpacity * 0.8} />
              <stop offset="100%" stopColor={theme.bodyGradient[2]} stopOpacity={baseOpacity * 0.4} />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner glow effect */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              background: `radial-gradient(circle, ${theme.accentColor}60, transparent 70%)`,
            }}
          />
        )}
      </div>
    </motion.div>
  )
}
