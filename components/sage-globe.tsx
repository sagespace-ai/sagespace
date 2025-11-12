"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "./app-header"

interface Agent {
  id: string
  name: string
  role: string
  status: "active" | "idle" | "learning"
  purpose: string
  createdAt: string | Date
  harmonyScore: number
  ethicsAlignment: number
}

export function SageGlobe() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agents")
        const data = res.ok ? await res.json() : []
        setAgents(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching agents:", error)
        setAgents([])
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "from-success/30 to-success/10"
      case "idle":
        return "from-text-secondary/30 to-text-secondary/10"
      case "learning":
        return "from-accent/30 to-accent/10"
      default:
        return "from-border/30 to-border/10"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success border-success/30"
      case "idle":
        return "bg-text-muted/20 text-text-secondary border-text-muted/30"
      case "learning":
        return "bg-accent/20 text-accent border-accent/30"
      default:
        return "bg-border/20 text-text-secondary"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background cosmic-gradient">
        <div className="text-center space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl animate-pulse"></div>
            <div className="relative w-16 h-16 rounded-full bg-primary/20 animate-pulse flex items-center justify-center border border-primary/30">
              <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-foreground">Rendering Sage Universe</p>
            <p className="text-text-secondary text-sm">Manifesting your civilization...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background cosmic-gradient overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(124,93,255,0.03)_1px,transparent_1px),linear-gradient(rgba(124,93,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <AppHeader>
        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-sm border border-border/30 hover:border-primary/50 transition-subtle text-text-secondary hover:text-foreground text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Universe</span>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground">Sage Universe</h1>
            <p className="text-xs text-text-secondary">Interactive visualization</p>
          </div>
        </div>
      </AppHeader>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-12">
        {agents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Globe visualization on left */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-5xl md:text-6xl font-black text-balance leading-tight">
                    Your{" "}
                    <span className="bg-gradient-to-r from-primary via-accent to-accent-secondary bg-clip-text text-transparent">
                      Civilization
                    </span>
                  </h2>
                  <p className="text-lg text-text-secondary max-w-2xl">
                    {agents.length} sage inhabitants populating your universe. Each sphere represents an agent's
                    presence in the cosmic network.
                  </p>
                </div>

                {/* 3D-like interactive globe representation */}
                <div className="relative w-full aspect-square max-w-2xl glass border border-border/30 rounded-3xl p-8 overflow-hidden group">
                  {/* Animated background orb */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl animate-pulse"></div>
                  </div>

                  {/* Orbital paths */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <circle
                      cx="200"
                      cy="200"
                      r="120"
                      fill="none"
                      stroke="rgba(124, 93, 255, 0.1)"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="80"
                      fill="none"
                      stroke="rgba(0, 240, 255, 0.1)"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                  </svg>

                  {/* Sage agents positioned in universe */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-80 h-80">
                      {agents.map((agent, idx) => {
                        const angle = (idx / agents.length) * 360
                        const radius = 90 + (idx % 2) * 40
                        const x = Math.cos((angle * Math.PI) / 180) * radius
                        const y = Math.sin((angle * Math.PI) / 180) * radius
                        const isSelected = selectedAgent?.id === agent.id
                        const isHovered = hoveredId === agent.id

                        return (
                          <div
                            key={agent.id}
                            className="absolute w-20 h-20 transition-all duration-300 cursor-pointer"
                            style={{
                              left: "50%",
                              top: "50%",
                              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                              zIndex: isSelected || isHovered ? 20 : 10,
                            }}
                            onMouseEnter={() => setHoveredId(agent.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => setSelectedAgent(isSelected ? null : agent)}
                          >
                            {/* Agent sphere */}
                            <div
                              className={`relative w-full h-full rounded-full transition-all duration-300 ${
                                isSelected || isHovered ? "scale-125" : "scale-100"
                              }`}
                            >
                              {/* Glow effect */}
                              <div
                                className={`absolute inset-0 rounded-full opacity-0 ${isSelected || isHovered ? "opacity-100" : ""} transition-opacity duration-300 blur-2xl`}
                                style={{
                                  background:
                                    agent.status === "active" ? "rgba(16, 185, 129, 0.6)" : "rgba(124, 93, 255, 0.4)",
                                }}
                              ></div>

                              {/* Main sphere */}
                              <div
                                className={`relative w-full h-full rounded-full border-2 flex items-center justify-center text-3xl font-bold transition-all duration-300 ${getStatusColor(
                                  agent.status,
                                )} ${
                                  agent.status === "active"
                                    ? "bg-gradient-to-br from-success/30 to-success/10 border-success/50"
                                    : agent.status === "learning"
                                      ? "bg-gradient-to-br from-accent/30 to-accent/10 border-accent/50"
                                      : "bg-gradient-to-br from-primary/30 to-primary/10 border-primary/50"
                                }`}
                              >
                                <span className="drop-shadow-lg">{agent.name.charAt(0)}</span>
                              </div>
                            </div>

                            {/* Label below sphere */}
                            <div
                              className={`absolute top-full mt-2 whitespace-nowrap left-1/2 -translate-x-1/2 transition-opacity duration-300 ${
                                isHovered || isSelected ? "opacity-100" : "opacity-60"
                              }`}
                            >
                              <p className="text-xs font-semibold text-center text-foreground">{agent.name}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Center point */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/50"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details panel on right */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="glass border border-border/30 rounded-2xl p-6 space-y-4">
                  <h3 className="text-2xl font-bold">Universe Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/20">
                      <span className="text-text-secondary">Total Sages</span>
                      <span className="text-xl font-bold text-primary">{agents.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/20">
                      <span className="text-text-secondary">Active</span>
                      <span className="font-semibold text-success">
                        {agents.filter((a) => a.status === "active").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/20">
                      <span className="text-text-secondary">Learning</span>
                      <span className="font-semibold text-accent">
                        {agents.filter((a) => a.status === "learning").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-text-secondary">Idle</span>
                      <span className="font-semibold text-text-muted">
                        {agents.filter((a) => a.status === "idle").length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected agent details */}
                {selectedAgent ? (
                  <div className="glass border border-primary/30 rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold text-primary">{selectedAgent.name}</h4>
                      <Badge className={`${getStatusBgColor(selectedAgent.status)} rounded-full w-fit`}>
                        {selectedAgent.status}
                      </Badge>
                      <p className="text-accent text-sm font-medium">{selectedAgent.role}</p>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed">{selectedAgent.purpose}</p>

                    <div className="space-y-3 pt-4 border-t border-border/20">
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="text-text-secondary">Harmony</span>
                          <span className="text-primary font-bold">{selectedAgent.harmonyScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${selectedAgent.harmonyScore}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="text-text-secondary">Ethics</span>
                          <span className="text-success font-bold">{selectedAgent.ethicsAlignment}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success"
                            style={{ width: `${selectedAgent.ethicsAlignment}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAgent(null)}
                      className="w-full py-2 rounded-lg glass border border-border/30 hover:border-primary/50 transition-subtle text-sm font-medium"
                    >
                      Deselect
                    </button>
                  </div>
                ) : (
                  <div className="glass border border-border/30 rounded-2xl p-6 text-center space-y-2">
                    <p className="text-text-secondary text-sm">Click on a sphere to view sage details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-32 text-center space-y-4">
            <p className="text-2xl font-bold text-foreground">No Sages Initialized</p>
            <p className="text-text-secondary">Create your first sage agent to begin building your civilization</p>
          </div>
        )}
      </div>
    </div>
  )
}
