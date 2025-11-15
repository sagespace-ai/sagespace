"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { HomeIcon, SendIcon, SparklesIcon, UserIcon, ZapIcon, UsersIcon, SearchIcon } from "@/components/icons"
import { SAGE_TEMPLATES } from "@/lib/sage-templates"

type SageMode = "single" | "circle" | "duel" | "council"
type UserMood = "focused" | "stressed" | "curious" | "overwhelmed" | "playful"

export default function PlaygroundPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const preselectedSageId = searchParams.get("sage")

  const [selectedMode, setSelectedMode] = useState<SageMode>("single")
  const [selectedMood, setSelectedMood] = useState<UserMood | null>(null)
  const [recommendedSages, setRecommendedSages] = useState<typeof SAGE_TEMPLATES>([])
  const [selectedSages, setSelectedSages] = useState<typeof SAGE_TEMPLATES>([])
  const [showRecommendations, setShowRecommendations] = useState(false)

  // Chat state
  const [messages, setMessages] = useState<Array<{ role: string; content: string; timestamp: Date; sageId?: string }>>(
    [],
  )
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [stats, setStats] = useState({ messagesSent: 0, xpEarned: 0, currentStreak: 1 })

  const [mobileView, setMobileView] = useState<"selector" | "chat">("selector")

  // Mouse tracking for cosmic effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (preselectedSageId && selectedSages.length === 0) {
      const sage = SAGE_TEMPLATES.find((s) => s.id === preselectedSageId)
      if (sage) {
        console.log("[v0] Preselecting sage from URL:", sage.name)
        setSelectedSages([sage])
        setSelectedMode("single")

        // Auto-start the session after a brief moment
        setTimeout(() => {
          const newConversationId = `conv-${Date.now()}`
          setConversationId(newConversationId)

          const welcomeContent = `Hello! I'm ${sage.name}, your ${sage.role}. ${sage.description}. How can I help you today?`

          setMessages([
            {
              role: "assistant",
              content: welcomeContent,
              timestamp: new Date(),
              sageId: sage.id,
            },
          ])

          setMobileView("chat")
        }, 500)
      }
    }
  }, [preselectedSageId])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const discoverPerfectSage = () => {
    console.log("[v0] Discovering sages for mode:", selectedMode, "mood:", selectedMood)

    // Filter sages based on mood and mode
    let filtered = [...SAGE_TEMPLATES]

    if (selectedMood) {
      // Simple mood-based filtering logic
      const moodDomainMap: Record<UserMood, string[]> = {
        focused: ["Education & Learning", "Business & Finance", "Technology & Innovation"],
        stressed: ["Health & Wellness", "Personal Development"],
        curious: ["Science & Research", "Creative & Arts", "Technology & Innovation"],
        overwhelmed: ["Health & Wellness", "Personal Development"],
        playful: ["Creative & Arts", "Social & Community"],
      }

      const preferredDomains = moodDomainMap[selectedMood] || []
      filtered = filtered.filter((s) => preferredDomains.includes(s.domain))
    }

    // Limit based on mode
    const limit = selectedMode === "circle" ? 3 : selectedMode === "council" ? 5 : selectedMode === "duel" ? 2 : 10
    setRecommendedSages(filtered.slice(0, limit))
    setShowRecommendations(true)
  }

  const startSession = () => {
    if (selectedSages.length === 0) return

    console.log(
      "[v0] Starting session with sages:",
      selectedSages.map((s) => s.name),
    )

    // Generate conversation ID
    const newConversationId = `conv-${Date.now()}`
    setConversationId(newConversationId)

    // Add welcome message
    const welcomeContent =
      selectedSages.length === 1
        ? `Hello! I'm ${selectedSages[0].name}, your ${selectedSages[0].role}. ${selectedSages[0].description}. How can I help you today?`
        : `Welcome! You're now in a session with ${selectedSages.map((s) => s.name).join(", ")}. We're here to help from multiple perspectives.`

    setMessages([
      {
        role: "assistant",
        content: welcomeContent,
        timestamp: new Date(),
        sageId: selectedSages[0].id,
      },
    ])

    setMobileView("chat")
  }

  const sendMessage = async () => {
    if (!input.trim() || selectedSages.length === 0) return

    const userMessage = { role: "user", content: input, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    
    const lowerInput = input.toLowerCase()
    const isMusicQuery = lowerInput.includes("play") || lowerInput.includes("music") || lowerInput.includes("song") || lowerInput.includes("artist")
    
    setInput("")
    setLoading(true)

    setStats((prev) => ({
      ...prev,
      messagesSent: prev.messagesSent + 1,
      xpEarned: prev.xpEarned + 10,
    }))

    if (isMusicQuery) {
      try {
        console.log("[v0] Music query detected, searching Spotify")
        const searchQuery = input.replace(/play|music|song|find/gi, "").trim()
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`)
        
        if (response.ok) {
          const spotifyResults = await response.json()
          
          if (spotifyResults.results && spotifyResults.results.length > 0) {
            const spotifyMessage = {
              role: "assistant" as const,
              content: `I found these tracks on Spotify:\n\n${spotifyResults.results.map((track: any, i: number) => 
                `${i + 1}. **${track.name}** by ${track.artists?.join(", ") || "Unknown"}\n   Album: ${track.album || "N/A"}\n   [Listen on Spotify](${track.uri})`
              ).join("\n\n")}`,
              timestamp: new Date(),
              sageId: selectedSages[0].id,
            }
            setMessages((prev) => [...prev, spotifyMessage])
            setLoading(false)
            return
          }
        }
      } catch (error: any) {
        console.error("[v0] Spotify search failed:", error.message)
      }
    }

    try {
      console.log("[v0] Sending chat request to /api/chat")

      const sage = selectedSages[0]
      const systemPrompt = `You are ${sage.name}, ${sage.role}. ${sage.description}\n\nYour expertise: ${sage.domain}\nYour perspective: ${sage.perspective}`

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ 
            role: m.role, 
            content: m.content 
          })),
          systemPrompt,
          sageId: sage.id,
        }),
      })

      console.log("[v0] Chat API response status:", response.status)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: 'Server error', message: `HTTP ${response.status}` }
        }
        
        console.error("[v0] Chat API error:", errorData)
        
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ ${errorData.message || errorData.error}\n\n${errorData.helpMessage || 'Please try again or contact support.'}`,
            timestamp: new Date(),
            sageId: selectedSages[0].id,
          },
        ])
        setLoading(false)
        return
      }

      const data = await response.json()
      
      console.log("[v0] Received response from AI")

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || data.message,
          timestamp: new Date(),
          sageId: selectedSages[0].id,
        },
      ])
    } catch (error: any) {
      console.error("[v0] Chat error:", error.message)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Connection error: ${error.message}\n\nPlease check your internet connection and try again.`,
          timestamp: new Date(),
          sageId: selectedSages[0].id,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Cosmic background effects */}
      <div
        className="fixed pointer-events-none opacity-30 blur-3xl z-0"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)",
          transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md bg-black/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/demo">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-cyan-400">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Hub
                  </Button>
                </Link>
                <div className="h-6 w-px bg-white/10" />
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Playground
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <ZapIcon className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs font-medium text-white">{stats.xpEarned} XP</span>
                </div>
                {/* Mobile toggle */}
                <div className="lg:hidden flex gap-1">
                  <Button
                    onClick={() => setMobileView("selector")}
                    variant={mobileView === "selector" ? "default" : "ghost"}
                    size="sm"
                  >
                    Selector
                  </Button>
                  <Button
                    onClick={() => setMobileView("chat")}
                    variant={mobileView === "chat" ? "default" : "ghost"}
                    size="sm"
                    disabled={selectedSages.length === 0}
                  >
                    Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main two-pane layout */}
        <main className="flex h-[calc(100vh-73px)]">
          {/* LEFT PANE: your Playground Selector */}
          <aside
            className={`w-full lg:w-96 border-r border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-800/90 backdrop-blur-xl overflow-y-auto ${
              mobileView === "selector" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="p-6 space-y-6">
              {/* Mode Selection */}
              <div>
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-yellow-400" />
                  Choose Your Experience
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "single" as SageMode, emoji: "👤", label: "Single Guide", desc: "One-on-one guidance" },
                    { id: "circle" as SageMode, emoji: "⭕", label: "Guide Council", desc: "3 perspectives" },
                    { id: "duel" as SageMode, emoji: "⚔️", label: "Duel", desc: "Debate 2 views" },
                    { id: "council" as SageMode, emoji: "🏛️", label: "Grand Council", desc: "5+ expert panel" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedMode === mode.id
                          ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/30"
                          : "bg-slate-800/50 border-slate-700 hover:border-purple-500/50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{mode.emoji}</div>
                      <div className="font-semibold text-white text-sm">{mode.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selector */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">How are you feeling?</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "focused" as UserMood, emoji: "🎯", label: "Focused" },
                    { id: "stressed" as UserMood, emoji: "😰", label: "Stressed" },
                    { id: "curious" as UserMood, emoji: "🤔", label: "Curious" },
                    { id: "overwhelmed" as UserMood, emoji: "😵", label: "Overwhelmed" },
                    { id: "playful" as UserMood, emoji: "🎮", label: "Playful" },
                  ].map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`px-3 py-2 rounded-lg border transition-all ${
                        selectedMood === mood.id
                          ? "bg-purple-500/20 border-purple-400 text-white"
                          : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-purple-500/50"
                      }`}
                    >
                      <span className="mr-1">{mood.emoji}</span>
                      <span className="text-xs">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hologram Preview */}
              {selectedSages.length > 0 && (
                <Card className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-2 border-cyan-500/30 p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-yellow-400" />
                    Active Session
                  </h3>
                  <div className="space-y-2">
                    {selectedSages.map((sage) => (
                      <div key={sage.id} className="flex items-center gap-3 p-2 bg-black/30 rounded-lg">
                        <span className="text-2xl">{sage.avatar}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm">{sage.name}</div>
                          <div className="text-xs text-slate-400">{sage.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Discover Button */}
              <Button
                onClick={discoverPerfectSage}
                disabled={!selectedMood}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-purple-500/50 disabled:opacity-50"
              >
                <SearchIcon className="w-5 h-5 mr-2" />
                Discover Perfect Guide{selectedMode !== "single" ? "s" : ""}
              </Button>

              {/* Recommendations List */}
              {showRecommendations && recommendedSages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Perfect Matches</h3>
                  <div className="space-h-2 max-h-96 overflow-y-auto">
                    {recommendedSages.map((sage) => (
                      <button
                        key={sage.id}
                        onClick={() => {
                          if (selectedSages.find((s) => s.id === sage.id)) {
                            setSelectedSages(selectedSages.filter((s) => s.id !== sage.id))
                          } else {
                            const maxSages =
                              selectedMode === "single"
                                ? 1
                                : selectedMode === "duel"
                                  ? 2
                                  : selectedMode === "circle"
                                    ? 3
                                    : 5
                            if (selectedSages.length < maxSages) {
                              setSelectedSages([...selectedSages, sage])
                            }
                          }
                        }}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                          selectedSages.find((s) => s.id === sage.id)
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400"
                            : "bg-slate-800/50 border-slate-700 hover:border-cyan-500/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{sage.avatar}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-white text-sm">{sage.name}</div>
                            <div className="text-xs text-slate-400">{sage.role}</div>
                            <div className="text-xs text-cyan-400 mt-1">{sage.domain}</div>
                          </div>
                          {selectedSages.find((s) => s.id === sage.id) && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Start Session Button */}
              {selectedSages.length > 0 && (
                <Button
                  onClick={startSession}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-green-500/50"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Start Session
                </Button>
              )}
            </div>
          </aside>

          {/* RIGHT PANE: Chat Interface */}
          <div className={`flex-1 flex flex-col ${mobileView === "chat" ? "block" : "hidden lg:flex"}`}>
            {conversationId && selectedSages.length > 0 ? (
              <>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-b border-purple-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {selectedSages.slice(0, 3).map((sage, i) => (
                          <div
                            key={sage.id}
                            className="text-3xl bg-slate-800 rounded-full border-2 border-slate-900"
                            style={{ zIndex: 10 - i }}
                          >
                            {sage.avatar}
                          </div>
                        ))}
                        {selectedSages.length > 3 && (
                          <div className="w-12 h-12 bg-purple-500/20 rounded-full border-2 border-purple-500 flex items-center justify-center text-xs text-white font-bold">
                            +{selectedSages.length - 3}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">
                          {selectedSages.length === 1 ? selectedSages[0].name : `${selectedSages.length} Guides`}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span>Online & Ready • {selectedMode === "single" ? "1-on-1" : selectedMode}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push("/council")}
                      size="sm"
                      className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50"
                    >
                      <UsersIcon className="w-4 h-4 mr-2" />
                      Consult Council
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-6xl mb-4">{selectedSages[0].avatar}</div>
                      <h3 className="text-xl font-bold text-white mb-2">Session Started!</h3>
                      <p className="text-slate-400 text-center max-w-md">
                        Ask your question to begin the conversation.
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, i) => {
                        const sage = selectedSages.find((s) => s.id === msg.sageId)
                        return (
                          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[85%] p-4 rounded-2xl ${
                                msg.role === "user"
                                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"
                                  : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                              } backdrop-blur-sm`}
                            >
                              <div className="flex items-start gap-3">
                                {msg.role === "assistant" && sage && <span className="text-2xl">{sage.avatar}</span>}
                                <div className="flex-1">
                                  {msg.role === "assistant" && sage && (
                                    <div className="text-xs font-semibold text-cyan-400 mb-1">{sage.name}</div>
                                  )}
                                  <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                                  <div className="text-xs text-slate-400 mt-2">
                                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </div>
                                </div>
                                {msg.role === "user" && <UserIcon className="w-6 h-6 text-cyan-400" />}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="p-4 rounded-2xl bg-purple-500/20 border border-purple-500/30">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{selectedSages[0].avatar}</span>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                                <div
                                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                />
                                <div
                                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Composer */}
                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-t border-purple-500/30 p-4">
                  <div className="flex gap-3 mb-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="Ask anything..."
                      className="flex-1 bg-slate-800/80 border-slate-600 focus:border-cyan-500 text-white rounded-xl px-4 py-3"
                      disabled={loading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-6 rounded-xl"
                    >
                      <SendIcon className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Enter to send • Shift+Enter for new line</span>
                    <span className="flex items-center gap-1">
                      <ZapIcon className="w-3 h-3 text-yellow-400" />
                      +10 XP per message
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                  <div className="text-6xl mb-6 animate-pulse">🔮</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Welcome to Playground</h3>
                  <p className="text-slate-400 mb-6">
                    Select a mode, choose your mood, and discover the perfect Guide companions to help you learn, grow,
                    and achieve your goals.
                  </p>
                  <div className="text-sm text-slate-500">👈 Use the selector on the left to get started</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
