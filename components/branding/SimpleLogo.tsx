'use client'

export function SimpleLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm: { container: 'h-8', icon: 32, text: 'text-lg' },
    md: { container: 'h-10', icon: 40, text: 'text-xl' },
    lg: { container: 'h-16', icon: 64, text: 'text-3xl' },
    xl: { container: 'h-24', icon: 96, text: 'text-5xl' }
  }

  const { container, icon, text: textSize } = sizes[size]

  return (
    <div className={`flex items-center gap-3 ${container}`}>
      <div className="relative" style={{ width: icon, height: icon }}>
        {/* Simple cosmic spiral without complex animations */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* Simplified spiral path */}
          <path
            d="M 50 50 Q 55 45, 60 45 Q 70 45, 75 55 Q 80 70, 70 80 Q 50 90, 35 75 Q 20 55, 35 40 Q 55 25, 70 40"
            fill="none"
            stroke="url(#simpleGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle cx="50" cy="50" r="4" fill="url(#simpleGradient)" />

          {/* Sage orbs */}
          <circle cx="30" cy="30" r="6" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.8" />
          <circle cx="30" cy="30" r="2" fill="#60A5FA" opacity="0.6" />

          <circle cx="70" cy="30" r="6" fill="none" stroke="#A78BFA" strokeWidth="2" opacity="0.8" />
          <circle cx="70" cy="30" r="2" fill="#A78BFA" opacity="0.6" />
        </svg>
      </div>

      <span className={`font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${textSize}`}>
        SageSpace
      </span>
    </div>
  )
}
