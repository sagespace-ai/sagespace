import type React from "react"
import { SageSpaceLogo } from "./sagespace-logo"

interface AppHeaderProps {
  children?: React.ReactNode
}

export function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/20 glass backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <SageSpaceLogo />
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </header>
  )
}
