import { ReactNode } from 'react'

type CosmicChipVariant = 'primary' | 'secondary' | 'success' | 'info'

interface CosmicChipProps {
  children: ReactNode
  variant?: CosmicChipVariant
  icon?: ReactNode
  className?: string
}

export function CosmicChip({
  children,
  variant = 'primary',
  icon,
  className = ''
}: CosmicChipProps) {
  const variantStyles = {
    primary: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    secondary: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}
