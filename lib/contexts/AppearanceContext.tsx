"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type ThemeMode = "system" | "dark" | "light"
export type DensityMode = "comfortable" | "cozy" | "compact"

interface AppearanceSettings {
  theme: ThemeMode
  reduceMotion: boolean
  feedDensity: DensityMode
}

interface AppearanceContextType {
  settings: AppearanceSettings
  updateSettings: (updates: Partial<AppearanceSettings>) => Promise<void>
  isLoading: boolean
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: "dark",
    reduceMotion: false,
    feedDensity: "comfortable",
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load appearance settings on mount
  useEffect(() => {
    loadAppearanceSettings()
  }, [])

  // Apply theme changes to document
  useEffect(() => {
    applyTheme(settings.theme)
    applyMotionPreference(settings.reduceMotion)
    applyDensity(settings.feedDensity)
  }, [settings.theme, settings.reduceMotion, settings.feedDensity])

  const loadAppearanceSettings = async () => {
    try {
      const res = await fetch('/api/personalization')
      if (res.ok) {
        const data = await res.json()
        if (data.appearance_settings) {
          setSettings({
            theme: data.appearance_settings.theme || "dark",
            reduceMotion: data.appearance_settings.reduceMotion || false,
            feedDensity: data.appearance_settings.feedDensity || "comfortable",
          })
        }
      }
    } catch (error) {
      console.error('[v0] Failed to load appearance settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<AppearanceSettings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)

    try {
      const res = await fetch('/api/personalization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appearance_settings: newSettings,
        }),
      })

      if (!res.ok) {
        console.error('[v0] Failed to save appearance settings')
        // Revert on failure
        setSettings(settings)
      }
    } catch (error) {
      console.error('[v0] Failed to save appearance settings:', error)
      // Revert on failure
      setSettings(settings)
    }
  }

  const applyTheme = (theme: ThemeMode) => {
    const root = document.documentElement
    
    if (theme === "system") {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle("dark", prefersDark)
      root.classList.toggle("light", !prefersDark)
    } else {
      root.classList.toggle("dark", theme === "dark")
      root.classList.toggle("light", theme === "light")
    }
  }

  const applyMotionPreference = (reduceMotion: boolean) => {
    const root = document.documentElement
    root.classList.toggle("reduce-motion", reduceMotion)
    
    // Also set CSS media query override
    if (reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms')
    } else {
      root.style.removeProperty('--animation-duration')
    }
  }

  const applyDensity = (density: DensityMode) => {
    const root = document.documentElement
    root.classList.remove("density-comfortable", "density-cozy", "density-compact")
    root.classList.add(`density-${density}`)
    
    // Set CSS variables for spacing
    const spacingMap = {
      comfortable: { card: '24px', section: '48px' },
      cozy: { card: '16px', section: '32px' },
      compact: { card: '12px', section: '24px' },
    }
    
    root.style.setProperty('--card-spacing', spacingMap[density].card)
    root.style.setProperty('--section-spacing', spacingMap[density].section)
  }

  return (
    <AppearanceContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  const context = useContext(AppearanceContext)
  if (context === undefined) {
    throw new Error("useAppearance must be used within AppearanceProvider")
  }
  return context
}
