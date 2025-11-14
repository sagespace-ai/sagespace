'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAppearance } from '@/lib/contexts/AppearanceContext'

interface CosmicBackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
  particles?: number
}

export default function CosmicBackground({ 
  intensity = 'medium',
  interactive = true,
  particles: particleOverride
}: CosmicBackgroundProps = {}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  let prefersReducedMotion = false
  try {
    const { appearance } = useAppearance()
    prefersReducedMotion = appearance?.motion === 'reduce'
  } catch (e) {
    // AppearanceContext not available, use default value
  }
  
  const particleCount = useMemo(() => {
    if (particleOverride) return particleOverride
    if (prefersReducedMotion) return 20
    
    const intensityMap = { low: 50, medium: 100, high: 150 }
    return intensityMap[intensity]
  }, [intensity, prefersReducedMotion, particleOverride])

  useEffect(() => {
    if (!interactive || prefersReducedMotion) return
    
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [interactive, prefersReducedMotion])

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  }, [particleCount])

  return (
    <>
      {interactive && !prefersReducedMotion && (
        <div
          className="fixed pointer-events-none opacity-30 blur-3xl z-0"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.4) 0%, rgba(167,139,250,0.3) 33%, rgba(236,72,153,0.2) 66%, transparent 100%)',
            transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
            transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease-out',
            willChange: 'transform',
          }}
        />
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute bg-white rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              opacity: particle.opacity,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(96,165,250,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(236,72,153,0.05) 0%, transparent 50%)',
        }}
      />
    </>
  )
}

export function CosmicBackgroundLow(props: Omit<CosmicBackgroundProps, 'intensity'>) {
  return <CosmicBackground {...props} intensity="low" />
}

export function CosmicBackgroundHigh(props: Omit<CosmicBackgroundProps, 'intensity'>) {
  return <CosmicBackground {...props} intensity="high" />
}

export function CosmicBackgroundStatic(props: Omit<CosmicBackgroundProps, 'interactive'>) {
  return <CosmicBackground {...props} interactive={false} />
}
