"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BrainIcon as Brain,
  TrendingUpIcon as TrendingUp,
  StarIcon as Star,
  ZapIcon as Zap,
  EyeIcon as Eye,
  ScaleIcon as Scale,
  ArrowLeftIcon as ArrowLeft,
  TrashIcon as Trash,
} from "@/components/icons"
import Link from "next/link"
import { AgentManagerDialog } from "@/components/agent-manager-dialog"

type Agent = {
  id: string
  name: string
  role: string
  avatar?: string
}

type Memory = {
  id: string
  memory_type: string
  content: string
  importance: number
  access_count: number
  created_at: string
}

type LearningEvent = {
  id: string
  event_type: string
  description: string
  confidence: number
  created_at: string
}

type Evolution = {
  id: string
  version: number
  changes: any
  reason: string
  harmony_score_delta: number
  ethics_alignment_delta: number
  created_at: string
}

export default function MemoryPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [memories, setMemories] = useState<Memory[]>([])
  const [learningEvents, setLearningEvents] = useState<LearningEvent[]>([])
  const [evolution, setEvolution] = useState<Evolution[]>([])
  const [stats, setStats] = useState({ totalMemories: 0, totalLearning: 0, avgImportance: 0 })

  useEffect(() => {
    fetchAgents()
  }, [])

  useEffect(() => {
    if (selectedAgent) {
      fetchAgentMemories(selectedAgent)
      fetchAgentLearning(selectedAgent)
      fetchAgentEvolution(selectedAgent)
    }
  }, [selectedAgent])

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents")
      const data = await res.json()
      setAgents(data.agents || [])
      if (data.agents && data.agents.length > 0) {
        setSelectedAgent(data.agents[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error)
    }
  }

  const fetchAgentMemories = async (agentId: string) => {
    try {
      const res = await fetch(`/api/memory/agent?agentId=${agentId}`)
      const data = await res.json()
      setMemories(data.memories || [])

      const total = data.memories?.length || 0
      const avgImp = total > 0 ? data.memories.reduce((sum: number, m: Memory) => sum + m.importance, 0) / total : 0

      setStats((prev) => ({ ...prev, totalMemories: total, avgImportance: avgImp }))
    } catch (error) {
      console.error("Failed to fetch memories:", error)
    }
  }

  const fetchAgentLearning = async (agentId: string) => {
    try {
      const res = await fetch(`/api/memory/learning?agentId=${agentId}`)
      const data = await res.json()
      setLearningEvents(data.learningEvents || [])
      setStats((prev) => ({ ...prev, totalLearning: data.learningEvents?.length || 0 }))
    } catch (error) {
      console.error("Failed to fetch learning events:", error)
    }
  }

  const fetchAgentEvolution = async (agentId: string) => {
    try {
      const res = await fetch(`/api/memory/evolution?agentId=${agentId}`)
      const data = await res.json()
      setEvolution(data.evolution || [])
    } catch (error) {
      console.error("Failed to fetch evolution:", error)
    }
  }

  const deleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        if (selectedAgent === agentId) {
          setSelectedAgent(null)
        }
        fetchAgents()
      }
    } catch (error) {
      console.error("Failed to delete agent:", error)
    }
  }

  const selectedAgentData = agents.find((a) => a.id === selectedAgent)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Agent Memory & Learning
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AgentManagerDialog onAgentCreated={fetchAgents} />
            <Link href="/observatory">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                Observatory
              </Button>
            </Link>
            <Link href="/council">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Scale className="w-4 h-4" />
                Council
              </Button>
            </Link>
            <Link href="/playground">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                Playground
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Agent Selector */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4">Select Agent</h2>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <div key={agent.id} className="relative group">
                      <button
                        onClick={() => setSelectedAgent(agent.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedAgent === agent.id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50 hover:bg-accent/5"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-2xl">{agent.avatar || "🤖"}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{agent.name}</div>
                            <div className="text-xs text-text-secondary">{agent.role}</div>
                          </div>
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAgent(agent.id)}
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Stats */}
            {selectedAgent && (
              <Card className="p-4">
                <h3 className="text-sm font-bold mb-3">Memory Stats</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Total Memories</div>
                    <div className="text-2xl font-bold">{stats.totalMemories}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Learning Events</div>
                    <div className="text-2xl font-bold">{stats.totalLearning}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Avg Importance</div>
                    <div className="text-2xl font-bold">{(stats.avgImportance * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {selectedAgent ? (
              <>
                {/* Agent Header */}
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{selectedAgentData?.avatar || "🤖"}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{selectedAgentData?.name}</h2>
                      <p className="text-text-secondary">{selectedAgentData?.role}</p>
                    </div>
                    <Badge variant="outline" className="gap-2">
                      <Brain className="w-4 h-4" />
                      Learning Enabled
                    </Badge>
                  </div>
                </Card>

                {/* Memories */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    Stored Memories
                  </h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {memories.map((memory) => (
                        <div key={memory.id} className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {memory.memory_type}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {(memory.importance * 100).toFixed(0)}% important
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {memory.access_count} accesses
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed">{memory.content}</p>
                          <div className="text-xs text-text-secondary mt-2">
                            {new Date(memory.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {memories.length === 0 && (
                        <div className="text-center py-8 text-text-secondary">
                          <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No memories stored yet</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Learning Events */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    Learning Timeline
                  </h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {learningEvents.map((event) => (
                        <div key={event.id} className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className="text-xs bg-green-500">{event.event_type}</Badge>
                            <div className="text-xs text-text-secondary">
                              {(event.confidence * 100).toFixed(0)}% confidence
                            </div>
                          </div>
                          <p className="text-sm">{event.description}</p>
                          <div className="text-xs text-text-secondary mt-2">
                            {new Date(event.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                      {learningEvents.length === 0 && (
                        <div className="text-center py-8 text-text-secondary">
                          <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No learning events yet</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Evolution History */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Evolution History
                  </h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {evolution.map((evo) => (
                        <div key={evo.id} className="p-4 rounded-lg border border-border bg-card">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              Version {evo.version}
                            </Badge>
                            <div className="flex gap-2">
                              {evo.harmony_score_delta !== 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Harmony {evo.harmony_score_delta > 0 ? "+" : ""}
                                  {evo.harmony_score_delta}
                                </Badge>
                              )}
                              {evo.ethics_alignment_delta !== 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Ethics {evo.ethics_alignment_delta > 0 ? "+" : ""}
                                  {evo.ethics_alignment_delta}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium mb-1">{evo.reason}</p>
                          <p className="text-xs text-text-secondary">
                            {JSON.stringify(evo.changes).substring(0, 100)}...
                          </p>
                          <div className="text-xs text-text-secondary mt-2">
                            {new Date(evo.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {evolution.length === 0 && (
                        <div className="text-center py-8 text-text-secondary">
                          <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No evolution recorded yet</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </>
            ) : (
              <Card className="p-8 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                  <p className="text-text-secondary">Select an agent to view their memory and learning</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
