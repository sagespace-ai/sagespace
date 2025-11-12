"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  EyeIcon,
  ScaleIcon,
  BrainIcon,
  MessageSquareIcon,
  SparklesIcon,
  HomeIcon,
  UserIcon,
  TrendingUpIcon,
  ZapIcon,
  AwardIcon,
  ActivityIcon,
} from "@/components/icons"

export default function AgentUniverseHub() {
  console.log("[v0] Demo page rendering...")

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stats, setStats] = useState({
    totalAgents: 300,
    activeNow: 47,
    conversations: 1247,
    userXP: 2850,
    userLevel: 7,
  })

  useEffect(() => {
    console.log("[v0] Demo page mounted")
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      console.log("[v0] Demo page unmounting")
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeNow: 40 + Math.floor(Math.random() * 20),
        conversations: prev.conversations + Math.floor(Math.random() * 3),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      href: "/playground",
      icon: MessageSquareIcon,
      title: "Playground",
      description: "Chat with 300+ specialized sages",
      gradient: "from-cyan-500 to-blue-500",
      hoverGradient: "from-cyan-400 to-blue-400",
      stats: "Active Chats: 47",
      emoji: "💬",
      delay: "0s",
    },
    {
      href: "/observatory",
      icon: EyeIcon,
      title: "Sage Watch",
      description: "Monitor real-time agent interactions",
      gradient: "from-purple-500 to-pink-500",
      hoverGradient: "from-purple-400 to-pink-400",
      stats: "Live Agents: 300",
      emoji: "🔭",
      delay: "0.1s",
    },
    {
      href: "/council",
      icon: ScaleIcon,
      title: "Sage Circle",
      description: "Multi-agent deliberation & voting",
      gradient: "from-emerald-500 to-teal-500",
      hoverGradient: "from-emerald-400 to-teal-400",
      stats: "Deliberations: 89",
      emoji: "⚖️",
      delay: "0.2s",
    },
    {
      href: "/memory",
      icon: BrainIcon,
      title: "Memory Lane",
      description: "Agent learning & evolution dashboard",
      gradient: "from-orange-500 to-red-500",
      hoverGradient: "from-orange-400 to-red-400",
      stats: "Memories: 12.4K",
      emoji: "🧠",
      delay: "0.3s",
    },
    {
      href: "/multiverse",
      icon: SparklesIcon,
      title: "Multiverse",
      description: "Persistent conversations across realities",
      gradient: "from-indigo-500 to-purple-500",
      hoverGradient: "from-indigo-400 to-purple-400",
      stats: "Saved: 34",
      emoji: "🌌",
      delay: "0.4s",
    },
    {
      href: "/universe-map",
      icon: ActivityIcon,
      title: "Universe Map",
      description: "3D spatial agent visualization",
      gradient: "from-pink-500 to-rose-500",
      hoverGradient: "from-pink-400 to-rose-400",
      stats: "Connections: 892",
      emoji: "🗺️",
      delay: "0.5s",
    },
    {
      href: "/persona-editor",
      icon: UserIcon,
      title: "Persona Forge",
      description: "Design & deploy custom AI agents",
      gradient: "from-yellow-500 to-amber-500",
      hoverGradient: "from-yellow-400 to-amber-400",
      stats: "Custom Sages: 12",
      emoji: "⚡",
      delay: "0.6s",
    },
    {
      href: "/marketplace",
      icon: SparklesIcon,
      title: "Sage Marketplace",
      description: "Browse 300 specialized AI companions",
      gradient: "from-cyan-500 to-purple-500",
      hoverGradient: "from-cyan-400 to-purple-400",
      stats: "Available: 300",
      emoji: "✨",
      delay: "0.7s",
    },
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
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
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-cyan-500/50 rounded-full animate-spin-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-2 border-purple-500/50 rotate-45 animate-pulse" />
        <div
          className="absolute top-1/2 right-1/3 w-72 h-72 border border-pink-500/30 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "25s" }}
        />
      </div>
      <div className="relative z-10">
        <header className="border-b border-white/10 backdrop-blur-md bg-black/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="group flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-cyan-400 transition-colors">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <div className="h-8 w-px bg-white/10" />
                <h1 className="text-2xl md:text-3xl font-bold relative hidden md:block group">
                  <span
                    className="relative inline-block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient"
                    style={{ backgroundSize: "300% 300%" }}
                  >
                    Hub
                    {/* Animated particle dots within the text */}
                    <span className="absolute -top-1 left-0 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-75"></span>
                    <span
                      className="absolute -top-1 right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: "0.5s" }}
                    ></span>
                    <span
                      className="absolute -bottom-1 left-6 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: "1s" }}
                    ></span>
                    {/* Glowing underline that pulses */}
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full animate-pulse-slow blur-sm"></span>
                  </span>
                  {/* Orbiting particles around the title */}
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 pointer-events-none">
                    <span
                      className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-sm animate-spin-slow"
                      style={{ transformOrigin: "0 40px" }}
                    ></span>
                    <span
                      className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full blur-sm animate-spin-slow"
                      style={{ transformOrigin: "0 40px", animationDirection: "reverse", animationDelay: "1s" }}
                    ></span>
                    <span
                      className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full blur-sm animate-spin-slow"
                      style={{ transformOrigin: "0 40px", animationDelay: "0.5s" }}
                    ></span>
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full backdrop-blur">
                  <div className="flex items-center gap-2">
                    <AwardIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Level {stats.userLevel}</span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex items-center gap-2">
                    <ZapIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">{stats.userXP.toLocaleString()} XP</span>
                  </div>
                  <div className="h-4 w-px bg-white/20" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-slate-300">{stats.activeNow} Active</span>
                  </div>
                </div>
                <Link href="/auth/login">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 border-0 shadow-lg shadow-purple-500/50"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12">
          <section className="mb-16 text-center animate-fade-in">
            <div className="inline-block px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm font-medium mb-6 animate-pulse">
              🟢 {stats.activeNow} Sages Active Now
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span
                className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient"
                style={{ backgroundSize: "300% 300%" }}
              >
                Welcome to Your
              </span>
              <span
                className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-reverse mt-2"
                style={{ backgroundSize: "300% 300%" }}
              >
                Agent Universe
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Command <span className="text-cyan-400 font-semibold">{stats.totalAgents} specialized AI sages</span>,
              orchestrate multi-agent collaboration, and shape the future of human-AI synergy
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl backdrop-blur">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUpIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Total Conversations</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.conversations.toLocaleString()}</div>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl backdrop-blur">
                <div className="flex items-center gap-2 mb-1">
                  <ActivityIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Active Sages</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalAgents}</div>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl backdrop-blur">
                <div className="flex items-center gap-2 mb-1">
                  <ZapIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Your XP</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.userXP.toLocaleString()}</div>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl backdrop-blur">
                <div className="flex items-center gap-2 mb-1">
                  <AwardIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Your Level</span>
                </div>
                <div className="text-2xl font-bold text-white">Level {stats.userLevel}</div>
              </div>
            </div>
            <div className="text-sm text-slate-400 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>All systems operational · {stats.activeNow} sages ready to assist</span>
            </div>
          </section>
          <section>
            <div className="mb-12 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Choose Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Adventure
                </span>
              </h3>
              <p className="text-slate-400 text-lg">Click any card to dive into a universe of possibilities</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => (
                <Link key={index} href={feature.href}>
                  <div
                    className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-purple-500/20 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 cursor-pointer animate-slide-up overflow-hidden"
                    style={{ animationDelay: feature.delay }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <div className="relative z-10">
                      <div className="text-6xl mb-4 group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">
                        {feature.emoji}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${feature.gradient} bg-opacity-20 border border-cyan-500/30 rounded-full text-xs font-medium text-white`}
                        >
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          {feature.stats}
                        </div>
                        <div className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </div>
                      </div>
                    </div>
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.hoverGradient} rounded-bl-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <section className="mt-20 mb-12">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <SparklesIcon className="w-8 h-8 text-yellow-400 animate-pulse" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Pro Tips to Level Up</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Combine Sages</h4>
                      <p className="text-sm text-slate-300">
                        Use the Playground to chat with multiple sages at once for deeper insights
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Track Your Growth</h4>
                      <p className="text-sm text-slate-300">
                        Earn XP and level up by engaging with sages and completing conversations
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">🔬</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Watch Them Collaborate</h4>
                      <p className="text-sm text-slate-300">
                        Use the Observatory to see how sages work together in real-time
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Create Your Own</h4>
                      <p className="text-sm text-slate-300">
                        Design custom sages in the Persona Forge tailored to your unique needs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="text-center mt-20 animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Start Your Journey Now
                </span>
              </h3>
              <p className="text-xl text-slate-300 mb-8">
                The universe awaits. Choose your first adventure and begin earning XP.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/playground">
                  <Button
                    size="lg"
                    className="text-lg px-10 py-6 relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50 border-0 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span>Launch Playground</span>
                      <span className="text-xl">🚀</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-6 relative group overflow-hidden bg-black/50 backdrop-blur border-2 border-purple-500/50 hover:border-cyan-400 text-white transition-all duration-500 shadow-xl hover:shadow-purple-500/50 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span>Explore Sages</span>
                      <span className="text-xl">✨</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
