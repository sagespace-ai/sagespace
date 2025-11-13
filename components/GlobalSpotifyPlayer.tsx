"use client"

import { useEffect, useState } from "react"
import { useGlobalAudio } from "@/lib/stores/audio-store"
import { Button } from "@/components/ui/button"
import { PlayIcon, SparklesIcon, XIcon } from "@/components/icons"
import { Card } from "@/components/ui/card"

export function GlobalSpotifyPlayer() {
  const audio = useGlobalAudio()
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Initialize connection on mount
    if (!audio.isInitialized && typeof window !== "undefined") {
      console.log("[v0] Initializing GlobalSpotifyPlayer...")
      audio.setInitialized(true)
      audio.connect()
    }
  }, [])

  useEffect(() => {
    // Show player when there's active playback
    setIsVisible(!!audio.metadata || audio.playbackState !== "idle")
  }, [audio.metadata, audio.playbackState])

  if (!isVisible) {
    return null
  }

  if (!audio.connected) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <Card className="bg-gradient-to-r from-purple-500/90 to-cyan-500/90 backdrop-blur-lg border-white/20 p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-white" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">Connect Spotify</h3>
              <p className="text-xs text-white/80">Play music with your Sages</p>
            </div>
            <Button
              onClick={() => {
                window.location.href = "/api/spotify/auth"
              }}
              size="sm"
              className="bg-white text-purple-600 hover:bg-white/90"
            >
              Connect
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg shadow-purple-500/50"
        >
          {audio.playbackState === "playing" ? (
            <div className="flex gap-0.5">
              <div className="w-1 h-4 bg-white animate-pulse" />
              <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: "0.1s" }} />
              <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: "0.2s" }} />
            </div>
          ) : (
            <PlayIcon className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Album Art */}
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex-shrink-0 overflow-hidden">
            {audio.metadata?.imageUrl ? (
              <img
                src={audio.metadata.imageUrl || "/placeholder.svg"}
                alt="Album art"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{audio.metadata?.title || "No track playing"}</h3>
            <p className="text-xs text-slate-400 truncate">{audio.metadata?.artist || "Unknown artist"}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => audio.previous()}
              variant="ghost"
              size="sm"
              className="text-white hover:text-cyan-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </Button>

            <Button
              onClick={() => {
                if (audio.playbackState === "playing") {
                  audio.pause()
                } else {
                  audio.resume()
                }
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            >
              {audio.playbackState === "playing" ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <PlayIcon className="w-5 h-5 text-white" />
              )}
            </Button>

            <Button onClick={() => audio.next()} variant="ghost" size="sm" className="text-white hover:text-cyan-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 18h2V6h-2zM6 18l8.5-6L6 6z" />
              </svg>
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="hidden md:block flex-1 max-w-md">
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                style={{
                  width: audio.metadata?.duration ? `${(audio.position / audio.metadata.duration) * 100}%` : "0%",
                }}
              />
            </div>
          </div>

          {/* Minimize Button */}
          <Button
            onClick={() => setIsMinimized(true)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
