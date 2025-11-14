import { ReactNode } from 'react'

type GradientVariant = 'aurora' | 'sunset' | 'ocean' | 'forest'

interface CosmicGradientTextProps {
  children: ReactNode
  variant?: GradientVariant
  animated?: boolean
  className?: string
}

export function CosmicGradientText({
  children,
  variant = 'aurora',
  animated = false,
  className = ''
}: CosmicGradientTextProps) {
  const gradients = {
    aurora: 'from-cyan-400 via-purple-400 to-pink-400',
    sunset: 'from-orange-400 via-pink-400 to-purple-500',
    ocean: 'from-blue-400 via-cyan-400 to-teal-400',
    forest: 'from-emerald-400 via-green-400 to-lime-400',
  }

  return (
    <span
      className={`
        bg-gradient-to-r ${gradients[variant]} 
        bg-clip-text text-transparent
        ${animated ? 'animate-gradient bg-[length:200%_auto]' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
