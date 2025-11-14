'use client'

import { usePathname } from 'next/navigation'
import { CommandBar } from './CommandBar'

export function CommandBarWrapper() {
  const pathname = usePathname()
  
  // Hide CommandBar on root path (marketing page) and auth pages
  const hideCommandBar = pathname === '/' || pathname?.startsWith('/auth/')
  
  if (hideCommandBar) {
    return null
  }
  
  return <CommandBar />
}
