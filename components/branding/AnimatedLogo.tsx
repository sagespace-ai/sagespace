'use client'

import { useAppearance } from '@/lib/contexts/AppearanceContext'
import { useEffect, useState } from 'react'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  variant?: 'default' | 'icon-only' | 'text-only'
  animate?: boolean
  className?: string
}

export function AnimatedLogo({ 
  size = 'md', 
  showText = true,
  variant = 'default',
  animate = true,
  className = '' 
}: AnimatedLogoProps) {
  let appearance = null
  try {
    const context = useAppearance()
    appearance = context?.appearance
  } catch (e) {
    // Context not available, use default behavior
    console.log('[v0] AnimatedLogo: AppearanceContext not available, using defaults')
  }

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const shouldAnimate = mounted && animate && !appearance?.reduceMotion

  const sizes = {
    sm: { container: 'h-8', icon: 32, text: 'text-lg' },
    md: { container: 'h-10', icon: 40, text: 'text-xl' },
    lg: { container: 'h-16', icon: 64, text: 'text-3xl' },
    xl: { container: 'h-24', icon: 96, text: 'text-5xl' }
  }

  const { container, icon, text: textSize } = sizes[size]

  if (variant === 'text-only') {
    return (
      <span className={`font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${textSize} ${shouldAnimate ? 'animate-gradient' : ''} ${className}`}>
        SageSpace
      </span>
    )
  }

  if (variant === 'icon-only') {
    return (
      <div className={`relative ${className}`} style={{ width: icon, height: icon }}>
        {/* Outer cosmic ring with particles */}
        <svg
          viewBox="0 0 100 100"
          className={`absolute inset-0 ${shouldAnimate ? 'animate-spin-slow' : ''}`}
          style={{ animationDuration: '30s' }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#outerGradient)"
            strokeWidth="1.5"
            opacity="0.6"
            className={shouldAnimate ? 'animate-pulse-slow' : ''}
          />
          
          {/* Orbital particles */}
          <circle cx="50" cy="5" r="2" fill="#60A5FA" className={shouldAnimate ? 'animate-pulse' : ''} />
          <circle cx="95" cy="50" r="2" fill="#A78BFA" className={shouldAnimate ? 'animate-pulse' : ''} style={{ animationDelay: '0.5s' }} />
          <circle cx="50" cy="95" r="2" fill="#EC4899" className={shouldAnimate ? 'animate-pulse' : ''} style={{ animationDelay: '1s' }} />
          <circle cx="5" cy="50" r="2" fill="#60A5FA" className={shouldAnimate ? 'animate-pulse' : ''} style={{ animationDelay: '1.5s' }} />

          <defs>
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Main spiral sage symbol */}
        <svg
          viewBox="0 0 100 100"
          className={`absolute inset-0 ${shouldAnimate ? 'animate-spiral' : ''}`}
        >
          <defs>
            <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="1" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="1" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Sacred geometry spiral path */}
          <path
            d="M 50 50 Q 55 45, 60 45 Q 70 45, 75 55 Q 80 70, 70 80 Q 50 90, 35 75 Q 20 55, 35 40 Q 55 25, 70 40"
            fill="none"
            stroke="url(#spiralGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
            className={shouldAnimate ? 'animate-draw' : ''}
          />

          {/* Inner wisdom dot */}
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="url(#spiralGradient)"
            filter="url(#glow)"
            className={shouldAnimate ? 'animate-pulse-slow' : ''}
          />

          {/* Sage orbs */}
          <circle
            cx="30"
            cy="30"
            r="6"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2"
            opacity="0.8"
            className={shouldAnimate ? 'animate-pulse' : ''}
            style={{ animationDelay: '0.3s' }}
          />
          <circle cx="30" cy="30" r="2" fill="#60A5FA" opacity="0.6" />

          <circle
            cx="70"
            cy="30"
            r="6"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="2"
            opacity="0.8"
            className={shouldAnimate ? 'animate-pulse' : ''}
            style={{ animationDelay: '0.6s' }}
          />
          <circle cx="70" cy="30" r="2" fill="#A78BFA" opacity="0.6" />

          {/* Cosmic dust particles */}
          <circle cx="40" cy="60" r="1" fill="#60A5FA" opacity="0.4" />
          <circle cx="60" cy="65" r="1" fill="#A78BFA" opacity="0.4" />
          <circle cx="55" cy="35" r="1" fill="#EC4899" opacity="0.4" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${container} ${className}`}>
      <div className="relative" style={{ width: icon, height: icon }}>
        {/* Outer cosmic ring with particles */}
        <svg
          viewBox="0 0 100 100"
          className={`absolute inset-0 ${shouldAnimate ? 'animate-spin-slow' : ''}`}
          style={{ animationDuration: '30s' }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#outerGradient)"
            strokeWidth="1.5"
            opacity="0.6"
            className={shouldAnimate ? 'animate-pulse-slow' : ''}
          />
          
          <circle cx="50" cy="5" r="2" fill="#60A5FA" className={shouldAnimate ? 'animate-pulse' : ''} />
          <circle cx="95" cy="50" r="2" fill="#A78BFA" className={shouldAnimate ? 'animate-pulse' : ''} style={{ animationDelay: '0.5s' }} />
          <circle cx="50" cy="95" r="2" fill="#EC4899" className={shouldAnimate ? 'animate-pulse' : ''} style={{ animationDelay: '1s' }} />
          <circle cx="5" cy="50" r="2" fill="#60A5FA" className={shouldAnimate ? 'animate-pulse' : ''} style={{ animationDelay: '1.5s' }} />

          <defs>
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          viewBox="0 0 100 100"
          className={`absolute inset-0 ${shouldAnimate ? 'animate-spiral' : ''}`}
        >
          <defs>
            <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="1" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="1" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 50 50 Q 55 45, 60 45 Q 70 45, 75 55 Q 80 70, 70 80 Q 50 90, 35 75 Q 20 55, 35 40 Q 55 25, 70 40"
            fill="none"
            stroke="url(#spiralGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
            className={shouldAnimate ? 'animate-draw' : ''}
          />

          <circle
            cx="50"
            cy="50"
            r="4"
            fill="url(#spiralGradient)"
            filter="url(#glow)"
            className={shouldAnimate ? 'animate-pulse-slow' : ''}
          />

          <circle
            cx="30"
            cy="30"
            r="6"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2"
            opacity="0.8"
            className={shouldAnimate ? 'animate-pulse' : ''}
            style={{ animationDelay: '0.3s' }}
          />
          <circle cx="30" cy="30" r="2" fill="#60A5FA" opacity="0.6" />

          <circle
            cx="70"
            cy="30"
            r="6"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="2"
            opacity="0.8"
            className={shouldAnimate ? 'animate-pulse' : ''}
            style={{ animationDelay: '0.6s' }}
          />
          <circle cx="70" cy="30" r="2" fill="#A78BFA" opacity="0.6" />

          <circle cx="40" cy="60" r="1" fill="#60A5FA" opacity="0.4" />
          <circle cx="60" cy="65" r="1" fill="#A78BFA" opacity="0.4" />
          <circle cx="55" cy="35" r="1" fill="#EC4899" opacity="0.4" />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${textSize} ${shouldAnimate ? 'animate-gradient' : ''}`}>
          SageSpace
        </span>
      )}
    </div>
  )
}
