import Link from "next/link"

export function SageSpaceLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      {/* Logo Icon - Cosmic sphere with orbiting elements */}
      <div className="relative w-10 h-10">
        {/* Central sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-pulse-slow"></div>

        {/* Orbiting ring */}
        <svg className="absolute inset-0 w-10 h-10 animate-spin-slow" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 3"
            className="text-accent/60"
          />
          {/* Orbital particles */}
          <circle cx="20" cy="4" r="2" fill="currentColor" className="text-cyan-400 animate-pulse" />
          <circle cx="36" cy="20" r="2" fill="currentColor" className="text-primary animate-pulse delay-100" />
          <circle cx="20" cy="36" r="2" fill="currentColor" className="text-accent animate-pulse delay-200" />
        </svg>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all"></div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:from-accent group-hover:via-primary group-hover:to-accent transition-all">
          SageSpace
        </span>
        <span className="text-[10px] text-text-muted -mt-1">Your Universe</span>
      </div>
    </Link>
  )
}
