'use client'

import { ReactNode, useRef, useState } from 'react'

interface Cosmic3DCardProps {
  children: ReactNode
  glowColor?: 'blue' | 'purple' | 'pink'
  className?: string
}

export function Cosmic3DCard({ children, glowColor = 'purple', className = '' }: Cosmic3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateXValue = ((y - centerY) / centerY) * -10
    const rotateYValue = ((x - centerX) / centerX) * 10
    
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  const glowColors = {
    blue: 'shadow-[0_0_30px_rgba(96,165,250,0.3)]',
    purple: 'shadow-[0_0_30px_rgba(167,139,250,0.3)]',
    pink: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative transition-all duration-200 ease-out
        ${glowColors[glowColor]}
        ${className}
      `}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  )
}
