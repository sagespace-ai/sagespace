"use client"

import { create } from "zustand"
import type { NavigationState, SystemStatus } from "@/lib/types/navigation"

interface NavigationStore extends NavigationState {
  setActiveSage: (sage: { id: string; name: string; avatar: string } | undefined) => void
  setActiveMode: (mode: string) => void
  setSessionActive: (active: boolean) => void
  setSystemStatus: (status: SystemStatus) => void
  setNotifications: (count: number) => void
  setInsights: (count: number) => void
  setAudioActive: (active: boolean) => void
}

export const useNavigationState = create<NavigationStore>((set) => ({
  activeMode: "/",
  sessionActive: false,
  systemStatus: "ok",
  notifications: 0,
  insights: 0,
  audioActive: false,

  setActiveSage: (activeSage) => set({ activeSage }),
  setActiveMode: (activeMode) => set({ activeMode }),
  setSessionActive: (sessionActive) => set({ sessionActive, systemStatus: sessionActive ? "active_session" : "ok" }),
  setSystemStatus: (systemStatus) => set({ systemStatus }),
  setNotifications: (notifications) => set({ notifications }),
  setInsights: (insights) => set({ insights }),
  setAudioActive: (audioActive) => set({ audioActive }),
}))
