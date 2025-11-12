"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { PlatformNav } from "@/components/platform-nav"
import { EyeIcon, ScaleIcon, BrainIcon, MessageSquareIcon, SparklesIcon, ActivityIcon } from "@/components/icons"

export default function HubPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stats, setStats] = useState({
    totalAgents: 300,
    activeNow: 47,
    conversations: 1247,
    userXP: 2850,
    userLevel: 7,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
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
      href: "/sage-watch",
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
      href: "/sage-circle",
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
      href: "/memory-lane",
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
      href: "/feed",
      icon: SparklesIcon,
      title: "The Feed",
      description: "Discover sage conversations & insights",
      gradient: "from-indigo-500 to-purple-500",
      hoverGradient: "from-indigo-400 to-purple-400",
      stats: "Trending: 24",
      emoji: "🌌",
      delay: "0.4s",
    },
    {
      href: "/galaxy",
      icon: ActivityIcon,
      title: "Sage Galaxy",
      description: "3D spatial agent visualization",
      gradient: "from-pink-500 to-rose-500",
      hoverGradient: "from-pink-400 to-rose-400",
      stats: "Connections: 892",
      emoji: "🗺️",
      delay: "0.5s",
    },
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="relative z-10">
        <PlatformNav currentPage="hub" userStats={stats} />

        <main className="container mx-auto px-4 py-12">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                      <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">
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
        </main>
      </div>
    </div>
  )
}
