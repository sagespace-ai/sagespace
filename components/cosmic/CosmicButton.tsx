import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type CosmicButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type CosmicButtonSize = 'sm' | 'md' | 'lg'

interface CosmicButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: CosmicButtonVariant
  size?: CosmicButtonSize
  glow?: boolean
  children: ReactNode
}

export function CosmicButton({
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  children,
  ...props
}: CosmicButtonProps) {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/50',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-pink-500/50',
    ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700',
    outline: 'bg-transparent border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:bg-cyan-500/10',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const glowStyles = glow && variant === 'primary' 
    ? 'hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]' 
    : glow && variant === 'secondary'
    ? 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]'
    : ''

  return (
    <Button
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${glowStyles} font-semibold rounded-xl transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}
