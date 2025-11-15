'use client'

import { usePathname } from 'next/navigation'
import { CommandBar } from './CommandBar'

export function CommandBarWrapper() {
  const pathname = usePathname()
  
  const hideCommandBar = pathname?.startsWith('/auth/')
  
  if (hideCommandBar) {
    return null
  }
  
  return <CommandBar />
}
