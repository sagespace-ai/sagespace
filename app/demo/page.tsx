"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { HomeIcon, UserIcon, TrendingUpIcon, ZapIcon, AwardIcon, ActivityIcon } from "@/components/icons"

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

  const router = useRouter()

  const startQuickDemo = () => {
    // Navigate to playground with pre-seeded conversation
    router.push("/playground?demo=true&sage=dr-wellness")
  }

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
      title: "Playground",
      description: "Chat with specialized AI companions in real-time",
      gradient: "from-cyan-500 to-blue-500",
      hoverGradient: "from-cyan-400 to-blue-400",
      stats: "Active Chats: 47",
      delay: "0s",
      animatedIcon: (
        <div className="relative w-16 h-16 mb-4 mx-auto flex items-center justify-center">
          <div className="relative">
            <div
              className="w-10 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl rounded-br-none animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              <div className="absolute top-2 left-2 flex gap-1">
                <div className="w-1 h-1 bg-white/80 rounded-full" />
                <div className="w-1 h-1 bg-white/80 rounded-full" />
                <div className="w-1 h-1 bg-white/80 rounded-full" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-cyan-300 to-blue-400 rotate-45" />
          </div>
        </div>
      ),
    },
    {
      href: "/observatory",
      title: "Sage Watch",
      description: "Discover trending sages and see what's popular",
      gradient: "from-purple-500 to-pink-500",
      hoverGradient: "from-purple-400 to-pink-400",
      stats: "Live Now: 300",
      delay: "0.1s",
      animatedIcon: (
        <div className="relative w-16 h-16 mb-4 mx-auto flex items-center justify-center">
          <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
            <path
              d="M6 36 L12 28 L18 32 L30 16 L42 22"
              stroke="url(#grad1)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-ping" />
        </div>
      ),
    },
    {
      href: "/council",
      title: "Sage Circle",
      description: "Get diverse perspectives from multiple sages",
      gradient: "from-emerald-500 to-teal-500",
      hoverGradient: "from-emerald-400 to-teal-400",
      stats: "Circles: 89",
      delay: "0.2s",
      animatedIcon: (
        <div className="relative w-16 h-16 mb-4 mx-auto flex items-center justify-center">
          <div className="relative w-14 h-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-emerald-400 rounded-full border-2 border-emerald-300 animate-bounce" />
            <div
              className="absolute bottom-0 left-2 w-5 h-5 bg-teal-400 rounded-full border-2 border-teal-300 animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="absolute bottom-0 right-2 w-5 h-5 bg-emerald-500 rounded-full border-2 border-emerald-400 animate-bounce"
              style={{ animationDelay: "0.6s" }}
            />
          </div>
        </div>
      ),
    },
    {
      href: "/memory",
      title: "Memory Lane",
      description: "Revisit your favorite conversations and insights",
      gradient: "from-orange-500 to-red-500",
      hoverGradient: "from-orange-400 to-red-400",
      stats: "Memories: 12.4K",
      delay: "0.3s",
      animatedIcon: (
        <div className="relative w-16 h-16 mb-4 mx-auto flex items-center justify-center">
          <div className="relative">
            <div className="w-10 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded shadow-lg">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-14 bg-gradient-to-b from-yellow-300 to-orange-300" />
              <div className="absolute top-3 left-2 right-2 space-y-1">
                <div className="h-0.5 bg-white/40 rounded" />
                <div className="h-0.5 bg-white/40 rounded w-3/4" />
                <div className="h-0.5 bg-white/40 rounded w-1/2" />
              </div>
            </div>
            <div className="absolute inset-0 animate-pulse" style={{ animationDuration: "3s" }} />
          </div>
        </div>
      ),
    },
    {
      href: "/multiverse",
      title: "The Feed",
      description: "Explore trending sage conversations and discoveries",
      gradient: "from-indigo-500 to-purple-500",
      hoverGradient: "from-indigo-400 to-purple-400",
      stats: "Trending: 34",
      delay: "0.4s",
      animatedIcon: (
        <div className="relative w-16 h-16 mb-4 mx-auto flex items-center justify-center overflow-hidden">
          <div className="relative w-12 h-14">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg border border-purple-300/30 shadow-lg"
                style={{
                  top: `${i * 4}px`,
                  zIndex: 3 - i,
                  opacity: 1 - i * 0.2,
                  animation: "slide-up 3s ease-in-out infinite",
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                <div className="p-2 space-y-1">
                  <div className="h-0.5 bg-white/60 rounded w-3/4" />
                  <div className="h-0.5 bg-white/40 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      href: "/universe-map",
      title: "Sage Galaxy",
      description: "Navigate through an immersive universe of sages",
      gradient: "from-pink-500 to-rose-500",
      hoverGradient: "from-pink-400 to-rose-400",
      stats: "Exploring: 892",
      delay: "0.5s",
      animatedIcon: (
        <div className="relative w-16 h-16 mb-4 mx-auto flex items-center justify-center">
          <div className="relative w-14 h-14">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-pulse" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full"
                style={{
                  transform: `rotate(${i * 60}deg) translateY(-20px) translateX(-50%)`,
                  transformOrigin: "0 0",
                  animation: "spin 8s linear infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
            <div
              className="absolute inset-0 border-2 border-pink-400/30 rounded-full"
              style={{ width: "120%", height: "120%", top: "-10%", left: "-10%" }}
            />
          </div>
        </div>
      ),
    },
    {
      href: "/persona-editor",
      title: "Sage Studio",
      description: "Create your own custom AI companions with unique personalities",
      gradient: "from-yellow-500 to-amber-500",
      hoverGradient: "from-yellow-400 to-amber-400",
      stats: "Your Sages: 12",
      delay: "0.6s",
      animatedIcon: (
        <div className="relative w-16 h-16 mb-4 mx-auto flex items-center justify-center">
          <div className="relative w-12 h-12 rotate-45">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-10 bg-gradient-to-t from-amber-500 to-yellow-300 rounded-full" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse" />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                style={{
                  top: `${10 + i * 8}px`,
                  left: `${12 + i * 6}px`,
                  animation: "twinkle 2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      href: "/multiverse",
      title: "Browse Sages",
      description: "Discover 300+ specialized AI companions by expertise",
      gradient: "from-cyan-500 to-purple-500",
      hoverGradient: "from-cyan-400 to-purple-400",
      stats: "Available: 300",
      delay: "0.7s",
      animatedIcon: (
        <div className="relative w-16 h-16 mb-4 mx-auto flex items-center justify-center">
          <div className="grid grid-cols-3 gap-1.5">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        </div>
      ),
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
                    <span className="absolute -top-1 left-0 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-75"></span>
                    <span
                      className="absolute -top-1 right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: "0.5s" }}
                    ></span>
                    <span
                      className="absolute -bottom-1 left-6 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75"
                      style={{ animationDelay: "1s" }}
                    ></span>
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full animate-pulse-slow blur-sm"></span>
                  </span>
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
                Welcome to
              </span>
              <span
                className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-reverse mt-2"
                style={{ backgroundSize: "300% 300%" }}
              >
                SageSpace
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Connect with <span className="text-cyan-400 font-semibold">{stats.totalAgents} specialized AI sages</span>
              , get collaborative wisdom from sage circles, and discover insights shared by the community
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
                    className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-purple-500/20 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 cursor-pointer animate-slide-up overflow-hidden h-[280px] flex flex-col"
                    style={{ animationDelay: feature.delay }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        {feature.animatedIcon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed flex-1">{feature.description}</p>
                      <div className="flex items-center justify-between mt-auto">
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
                  <AwardIcon className="w-8 h-8 text-yellow-400 animate-pulse" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Pro Tips to Get Started</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Start a Conversation</h4>
                      <p className="text-sm text-slate-300">
                        Head to the Playground and chat with any sage that fits your needs
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">🤝</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Get Multiple Perspectives</h4>
                      <p className="text-sm text-slate-300">
                        Use Sage Circle to consult multiple experts and get well-rounded advice
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">🌊</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Explore The Feed</h4>
                      <p className="text-sm text-slate-300">
                        See what conversations others are having and discover new insights
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Create Your Own Sage</h4>
                      <p className="text-sm text-slate-300">
                        Design a custom AI companion in Sage Studio tailored to your unique needs
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
                Your journey to wisdom begins here. Choose your first experience and start exploring.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={startQuickDemo}
                  size="lg"
                  className="text-lg px-10 py-6 relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/50 border-0 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>Try Demo (2s)</span>
                    <span className="text-xl">⚡</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                </Button>
                <Link href="/playground">
                  <Button
                    size="lg"
                    className="text-lg px-10 py-6 relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50 border-0 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span>Start Chatting</span>
                      <span className="text-xl">💬</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                  </Button>
                </Link>
                <Link href="/universe-map">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-6 relative group overflow-hidden bg-black/50 backdrop-blur border-2 border-purple-500/50 hover:border-cyan-400 text-white transition-all duration-500 shadow-xl hover:shadow-purple-500/50 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span>Explore Sage Galaxy</span>
                      <span className="text-xl">🌌</span>
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
