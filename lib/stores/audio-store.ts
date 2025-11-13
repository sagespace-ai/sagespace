import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AudioMetadata {
  title: string
  artist: string
  imageUrl?: string
  type: "track" | "episode"
  album?: string
  duration?: number
}

export interface AudioState {
  connected: boolean
  currentUri?: string
  playbackState: "playing" | "paused" | "idle"
  metadata?: AudioMetadata
  position: number
  volume: number
  deviceId?: string
  isInitialized: boolean
}

export interface AudioActions {
  connect: () => Promise<void>
  play: (uri: string) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
  setVolume: (volume: number) => void
  updateStateFromSpotify: () => Promise<void>
  setConnected: (connected: boolean) => void
  setPlaybackState: (state: "playing" | "paused" | "idle") => void
  setCurrentUri: (uri?: string) => void
  setMetadata: (metadata?: AudioMetadata) => void
  setPosition: (position: number) => void
  setDeviceId: (deviceId?: string) => void
  setInitialized: (initialized: boolean) => void
}

export const useGlobalAudio = create<AudioState & AudioActions>()(
  persist(
    (set, get) => ({
      // State
      connected: false,
      playbackState: "idle",
      position: 0,
      volume: 0.5,
      isInitialized: false,

      // Actions
      connect: async () => {
        try {
          console.log("[v0] Connecting to Spotify...")
          const response = await fetch("/api/spotify/me")
          const data = await response.json()

          if (response.ok && data.connected) {
            set({ connected: true })
            console.log("[v0] Successfully connected to Spotify:", data.displayName)
            // Start polling current state
            get().updateStateFromSpotify()
          } else {
            console.log("[v0] Spotify not connected, need OAuth")
            set({ connected: false })
          }
        } catch (error) {
          console.error("[v0] Failed to connect to Spotify:", error)
          set({ connected: false })
        }
      },

      play: async (uri: string) => {
        try {
          console.log("[v0] Playing Spotify URI:", uri)
          const response = await fetch("/api/spotify/play", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uri }),
          })

          if (response.ok) {
            set({ currentUri: uri, playbackState: "playing" })
            // Update metadata after a brief delay
            setTimeout(() => get().updateStateFromSpotify(), 500)
          } else {
            const error = await response.json()
            console.error("[v0] Failed to play:", error)
          }
        } catch (error) {
          console.error("[v0] Error playing track:", error)
        }
      },

      pause: async () => {
        try {
          console.log("[v0] Pausing playback...")
          const response = await fetch("/api/spotify/pause", { method: "POST" })
          if (response.ok) {
            set({ playbackState: "paused" })
          }
        } catch (error) {
          console.error("[v0] Error pausing:", error)
        }
      },

      resume: async () => {
        try {
          console.log("[v0] Resuming playback...")
          const response = await fetch("/api/spotify/resume", { method: "POST" })
          if (response.ok) {
            set({ playbackState: "playing" })
          }
        } catch (error) {
          console.error("[v0] Error resuming:", error)
        }
      },

      next: async () => {
        try {
          const response = await fetch("/api/spotify/next", { method: "POST" })
          if (response.ok) {
            setTimeout(() => get().updateStateFromSpotify(), 500)
          }
        } catch (error) {
          console.error("[v0] Error skipping to next:", error)
        }
      },

      previous: async () => {
        try {
          const response = await fetch("/api/spotify/previous", { method: "POST" })
          if (response.ok) {
            setTimeout(() => get().updateStateFromSpotify(), 500)
          }
        } catch (error) {
          console.error("[v0] Error going to previous:", error)
        }
      },

      setVolume: (volume: number) => {
        set({ volume })
        fetch("/api/spotify/volume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ volume: Math.round(volume * 100) }),
        }).catch(console.error)
      },

      updateStateFromSpotify: async () => {
        try {
          const response = await fetch("/api/spotify/current")
          if (response.ok) {
            const data = await response.json()
            console.log("[v0] Current Spotify state:", data)

            set({
              playbackState: data.isPlaying ? "playing" : data.uri ? "paused" : "idle",
              currentUri: data.uri,
              position: data.position || 0,
              metadata: data.uri
                ? {
                    title: data.title || "Unknown",
                    artist: data.artist || "Unknown",
                    imageUrl: data.imageUrl,
                    type: data.type || "track",
                    album: data.album,
                    duration: data.duration,
                  }
                : undefined,
            })
          }
        } catch (error) {
          console.error("[v0] Error fetching current state:", error)
        }
      },

      // Setters for external updates
      setConnected: (connected) => set({ connected }),
      setPlaybackState: (playbackState) => set({ playbackState }),
      setCurrentUri: (currentUri) => set({ currentUri }),
      setMetadata: (metadata) => set({ metadata }),
      setPosition: (position) => set({ position }),
      setDeviceId: (deviceId) => set({ deviceId }),
      setInitialized: (isInitialized) => set({ isInitialized }),
    }),
    {
      name: "sagespace-audio-storage",
      partialize: (state) => ({
        volume: state.volume,
        deviceId: state.deviceId,
      }),
    },
  ),
)

// Auto-poll Spotify state every 10 seconds when playing
if (typeof window !== "undefined") {
  setInterval(() => {
    const state = useGlobalAudio.getState()
    if (state.connected && state.playbackState === "playing") {
      state.updateStateFromSpotify()
    }
  }, 10000)
}
