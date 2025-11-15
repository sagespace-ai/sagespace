'use client'

import { motion } from 'framer-motion'
import { SageHaloProps } from '@/lib/sage-avatar/types'

const RUNE_GLYPHS = [
  'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ',
  'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ',
]

export function SageHalo({ theme, evolutionStage, isSpeaking, isThinking, size, reduceMotion }: SageHaloProps) {
  const runeCount = {
    1: 3,
    2: 6,
    3: 12,
    4: 16,
  }[evolutionStage]

  const haloRadius = size * 0.35
  const rotationDuration = reduceMotion ? 0 : isThinking ? 8 : isSpeaking ? 10 : 16
  
  const runes = RUNE_GLYPHS.slice(0, runeCount)

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative"
        style={{ width: haloRadius * 2, height: haloRadius * 2 }}
        animate={reduceMotion ? {} : {
          rotate: 360,
        }}
        transition={{
          duration: rotationDuration,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {runes.map((rune, index) => {
          const angle = (index / runeCount) * Math.PI * 2
          const x = Math.cos(angle) * haloRadius
          const y = Math.sin(angle) * haloRadius

          return (
            <motion.div
              key={index}
              className="absolute text-center font-bold"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                fontSize: size * 0.08,
                color: theme.runeColor,
                textShadow: `0 0 ${size * 0.02}px ${theme.runeColor}`,
              }}
              animate={reduceMotion ? {} : {
                opacity: isThinking ? [0.5, 1, 0.5] : [0.7, 1, 0.7],
                scale: isSpeaking ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.1,
              }}
            >
              {rune}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Halo rings for Stage 4 */}
      {evolutionStage === 4 && (
        <motion.div
          className="absolute"
          style={{
            width: haloRadius * 2.4,
            height: haloRadius * 2.4,
            border: `2px solid ${theme.runeColor}40`,
            borderRadius: '50%',
          }}
          animate={reduceMotion ? {} : {
            rotate: -360,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            rotate: {
              duration: rotationDuration * 1.5,
              repeat: Infinity,
              ease: 'linear',
            },
            opacity: {
              duration: 3,
              repeat: Infinity,
            },
          }}
        />
      )}
    </div>
  )
}
