'use client'

// import { designTokens } from '@/lib/design-system/tokens'

type LogoVariant = 'full' | 'icon' | 'mono' | 'inverse'
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface CosmicLogoProps {
  variant?: LogoVariant
  size?: LogoSize
  animated?: boolean
  className?: string
}

const sizeMap = {
  xs: { container: 24, icon: 20, text: 'text-sm' },
  sm: { container: 32, icon: 28, text: 'text-base' },
  md: { container: 40, icon: 36, text: 'text-lg' },
  lg: { container: 56, icon: 48, text: 'text-2xl' },
  xl: { container: 80, icon: 72, text: 'text-4xl' },
  '2xl': { container: 120, icon: 108, text: 'text-6xl' },
}

export function CosmicLogo({ 
  variant = 'full', 
  size = 'md', 
  animated = false,
  className = '' 
}: CosmicLogoProps) {
  const { container, icon, text: textSize } = sizeMap[size]
  
  const gradientId = `logo-gradient-${variant}-${size}`
  const showWordmark = variant === 'full' || variant === 'inverse'
  const isMono = variant === 'mono'
  const isInverse = variant === 'inverse'

  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ height: container }}>
      {/* Icon */}
      <div 
        className={`relative ${animated ? 'animate-pulse-slow' : ''}`}
        style={{ width: icon, height: icon }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            {!isMono && (
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            )}
          </defs>

          {/* Orbital rings representing the Multiverse */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke={isMono ? (isInverse ? '#fff' : '#000') : `url(#${gradientId})`}
            strokeWidth="2" 
            opacity="0.3"
            className={animated ? 'animate-spin-slow' : ''}
          />
          <circle 
            cx="50" 
            cy="50" 
            r="30" 
            fill="none" 
            stroke={isMono ? (isInverse ? '#fff' : '#000') : `url(#${gradientId})`}
            strokeWidth="2" 
            opacity="0.5"
          />

          {/* Center cosmic spiral */}
          <path
            d="M 50 50 Q 55 45, 60 45 Q 70 45, 75 55 Q 80 70, 70 80 Q 50 90, 35 75 Q 20 55, 35 40 Q 55 25, 70 40"
            fill="none"
            stroke={isMono ? (isInverse ? '#fff' : '#000') : `url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
            className={animated ? 'animate-draw' : ''}
          />

          {/* Center node (Intelligence Core) */}
          <circle 
            cx="50" 
            cy="50" 
            r="5" 
            fill={isMono ? (isInverse ? '#fff' : '#000') : `url(#${gradientId})`}
            className={animated ? 'animate-ping-slow' : ''}
          />

          {/* Orbiting Sage nodes */}
          <g className={animated ? 'animate-orbit-1' : ''}>
            <circle 
              cx="70" 
              cy="50" 
              r="6" 
              fill="none" 
              stroke={isMono ? (isInverse ? '#fff' : '#000') : '#60A5FA'} 
              strokeWidth="2" 
              opacity="0.8"
            />
            <circle cx="70" cy="50" r="2" fill={isMono ? (isInverse ? '#fff' : '#000') : '#60A5FA'} />
          </g>

          <g className={animated ? 'animate-orbit-2' : ''}>
            <circle 
              cx="30" 
              cy="50" 
              r="6" 
              fill="none" 
              stroke={isMono ? (isInverse ? '#fff' : '#000') : '#A78BFA'} 
              strokeWidth="2" 
              opacity="0.8"
            />
            <circle cx="30" cy="50" r="2" fill={isMono ? (isInverse ? '#fff' : '#000') : '#A78BFA'} />
          </g>
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <span 
          className={`font-bold ${textSize} ${
            isMono 
              ? (isInverse ? 'text-white' : 'text-black')
              : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
          }`}
        >
          SageSpace
        </span>
      )}
    </div>
  )
}

// Specialized variants for common use cases
export function CosmicLogoFull(props: Omit<CosmicLogoProps, 'variant'>) {
  return <CosmicLogo {...props} variant="full" />
}

export function CosmicLogoIcon(props: Omit<CosmicLogoProps, 'variant'>) {
  return <CosmicLogo {...props} variant="icon" />
}

export function CosmicLogoMono(props: Omit<CosmicLogoProps, 'variant'>) {
  return <CosmicLogo {...props} variant="mono" />
}

export function CosmicLogoInverse(props: Omit<CosmicLogoProps, 'variant'>) {
  return <CosmicLogo {...props} variant="inverse" />
}

// Animated loading variant
export function CosmicLogoThinking(props: Omit<CosmicLogoProps, 'animated'>) {
  return <CosmicLogo {...props} animated={true} />
}
