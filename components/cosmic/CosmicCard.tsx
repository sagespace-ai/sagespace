import { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

interface CosmicCardProps {
  children: ReactNode
  hover?: boolean
  glow?: 'blue' | 'purple' | 'pink' | 'aurora'
  className?: string
  onClick?: () => void
}

export function CosmicCard({
  children,
  hover = true,
  glow,
  className = '',
  onClick
}: CosmicCardProps) {
  const glowStyles = {
    blue: 'hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]',
    purple: 'hover:border-purple-400/60 hover:shadow-[0_0_40px_rgba(167,139,250,0.2)]',
    pink: 'hover:border-pink-400/60 hover:shadow-[0_0_40px_rgba(236,72,153,0.2)]',
    aurora: 'hover:border-cyan-400/60 hover:shadow-[0_20px_25px_-5px_rgba(34,211,238,0.15),0_8px_10px_-6px_rgba(34,211,238,0.15),0_0_40px_rgba(168,85,247,0.2)]',
  }

  return (
    <Card
      className={`
        bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl 
        border-2 border-purple-500/20 rounded-2xl shadow-2xl
        ${hover ? 'transition-all duration-300 hover:-translate-y-0.5' : ''}
        ${glow ? glowStyles[glow] : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}
