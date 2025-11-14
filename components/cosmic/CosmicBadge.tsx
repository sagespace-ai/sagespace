import { ReactNode } from 'react'

type CosmicBadgeSize = 'sm' | 'md' | 'lg'

interface CosmicBadgeProps {
  children: ReactNode
  size?: CosmicBadgeSize
  pulse?: boolean
  className?: string
}

export function CosmicBadge({
  children,
  size = 'md',
  pulse = false,
  className = ''
}: CosmicBadgeProps) {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full 
        bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
        border border-cyan-400/30 text-cyan-300 font-medium
        ${sizeStyles[size]}
        ${pulse ? 'animate-pulse-slow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
