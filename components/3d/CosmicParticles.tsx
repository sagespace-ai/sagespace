'use client'

import { useEffect, useRef } from 'react'
import { CosmicParticleSystem } from '@/lib/3d/cosmic-particles'

export function CosmicParticles({ intensity = 100 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const systemRef = useRef<CosmicParticleSystem | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    systemRef.current = new CosmicParticleSystem(intensity)
    systemRef.current.mount(canvasRef.current)

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      systemRef.current?.unmount()
      window.removeEventListener('resize', handleResize)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
