'use client'

import { SageAvatarProps } from '@/lib/sage-avatar/types'
import { getSageTheme } from '@/lib/sage-avatar/themes'
import { SageBase } from './SageBase'
import { SageHalo } from './SageHalo'
import { SageFaceGlow } from './SageFaceGlow'
import { SageParticles } from './SageParticles'
import { SageAura } from './SageAura'
import { useState } from 'react'

export function SageAvatar({
  archetype,
  evolutionStage,
  emotion = 'calm',
  isSpeaking = false,
  isThinking = false,
  size = 200,
  reduceMotion = false,
  className = '',
  onHover,
  onTap,
}: SageAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const theme = getSageTheme(archetype)
  const sizeNum = typeof size === 'number' ? size : parseInt(size)

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => {
        setIsHovered(true)
        onHover?.()
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onTap}
    >
      {/* Layers rendered from back to front */}
      <SageAura
        theme={theme}
        evolutionStage={evolutionStage}
        isSpeaking={isSpeaking || isHovered}
        size={sizeNum}
      />
      
      <SageParticles
        theme={theme}
        evolutionStage={evolutionStage}
        emotion={emotion}
        size={sizeNum}
        reduceMotion={reduceMotion}
      />
      
      <SageBase
        theme={theme}
        evolutionStage={evolutionStage}
        emotion={emotion}
        isSpeaking={isSpeaking || isHovered}
        size={sizeNum}
        reduceMotion={reduceMotion}
      />
      
      <SageHalo
        theme={theme}
        evolutionStage={evolutionStage}
        isSpeaking={isSpeaking || isHovered}
        isThinking={isThinking}
        size={sizeNum}
        reduceMotion={reduceMotion}
      />
      
      <SageFaceGlow
        theme={theme}
        emotion={emotion}
        isSpeaking={isSpeaking || isHovered}
        size={sizeNum}
      />
    </div>
  )
}
