// Cosmic Icon System - SVG icons aligned with brand

export function OrbitalIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  )
}

export function SageNodeIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
      <circle cx="18" cy="12" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="6" cy="12" r="2" fill="currentColor" opacity="0.6"/>
    </svg>
  )
}

export function CosmicSparkIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L13 10L12 12L11 10L12 2Z" fill="currentColor"/>
      <path d="M12 22L13 14L12 12L11 14L12 22Z" fill="currentColor"/>
      <path d="M2 12L10 13L12 12L10 11L2 12Z" fill="currentColor"/>
      <path d="M22 12L14 13L12 12L14 11L22 12Z" fill="currentColor"/>
    </svg>
  )
}
