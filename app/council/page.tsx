"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  UsersIcon as Users,
  ScaleIcon as Scale,
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  ClockIcon as Clock,
  SparklesIcon as Sparkles,
  EyeIcon as Eye,
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
  harmony_score?: number
  ethics_alignment?: number
}

type Deliberation = {
  agentName: string
  phase: string
  content: string
  citedLaws: string[]
}

type Vote = {
  agentName: string
  vote: string
  reasoning: string
  confidence: number
}

export default function CouncilPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [queryType, setQueryType] = useState("complex")
  const [isDeliberating, setIsDeliberating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [deliberations, setDeliberations] = useState<Deliberation[]>([])
  const [votes, setVotes] = useState<Vote[]>([])

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents")
      const data = await res.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error("Failed to fetch agents:", error)
    }
  }

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) => (prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]))
  }

  const deleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setSelectedAgents((prev) => prev.filter((id) => id !== agentId))
        fetchAgents()
      }
    } catch (error) {
      console.error("Failed to delete agent:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || selectedAgents.length < 2) return

    setIsDeliberating(true)
    setResult(null)
    setDeliberations([])
    setVotes([])

    try {
      const res = await fetch("/api/council/deliberate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          agentIds: selectedAgents,
          queryType,
          consensusThreshold: 0.66,
        }),
      })

      const data = await res.json()

      if (data.result) {
        setResult(data.result)
        setDeliberations(data.result.deliberations || [])
        setVotes(data.result.votes || [])
      }
    } catch (error) {
      console.error("Council deliberation failed:", error)
    } finally {
      setIsDeliberating(false)
    }
  }

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
              <Scale className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Agent Council
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
            <Link href="/playground">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                Playground
              </Button>
            </Link>
            <Badge variant="outline" className="gap-2">
              <Users className="w-4 h-4" />
              {selectedAgents.length} agents selected
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Agent Selection */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Select Council Members
              </h2>
              <p className="text-sm text-text-secondary mb-4">Choose at least 2 agents to form a council</p>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {agents.map((agent) => {
                    const isSelected = selectedAgents.includes(agent.id)
                    return (
                      <div key={agent.id} className="relative group">
                        <button
                          onClick={() => toggleAgent(agent.id)}
                          className={`w-full p-3 rounded-lg border transition-all text-left ${
                            isSelected
                              ? "border-accent bg-accent/10"
                              : "border-border hover:border-accent/50 hover:bg-accent/5"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{agent.avatar || "🤖"}</div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm">{agent.name}</div>
                              <div className="text-xs text-text-secondary">{agent.role}</div>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  H: {agent.harmony_score || 75}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  E: {agent.ethics_alignment || 85}
                                </Badge>
                              </div>
                            </div>
                            {isSelected && <CheckCircle className="w-5 h-5 text-accent" />}
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
                    )
                  })}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Query and Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Query Input */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Complex Query
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Query Type</label>
                  <select
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background"
                  >
                    <option value="ethical">Ethical Dilemma</option>
                    <option value="technical">Technical Decision</option>
                    <option value="philosophical">Philosophical Question</option>
                    <option value="complex">Complex Problem</option>
                    <option value="creative">Creative Challenge</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Query</label>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pose a complex question that requires collective wisdom..."
                    className="h-24"
                    disabled={isDeliberating}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isDeliberating || selectedAgents.length < 2 || !query.trim()}
                  className="w-full gap-2"
                >
                  {isDeliberating ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Council Deliberating...
                    </>
                  ) : (
                    <>
                      <Scale className="w-4 h-4" />
                      Convene Council
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Results */}
            {result && (
              <>
                {/* Final Decision */}
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    {result.consensusReached ? (
                      <CheckCircle className="w-8 h-8 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 text-orange-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">
                        {result.consensusReached ? "Consensus Reached" : "No Consensus"}
                      </h3>
                      <p className="text-sm text-text-secondary mb-4">{result.finalRecommendation}</p>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-3 rounded-lg bg-green-500/10">
                          <div className="text-2xl font-bold text-green-500">{result.approveCount}</div>
                          <div className="text-xs text-text-secondary">Approve</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-red-500/10">
                          <div className="text-2xl font-bold text-red-500">{result.rejectCount}</div>
                          <div className="text-xs text-text-secondary">Reject</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                          <div className="text-2xl font-bold text-yellow-500">{result.conditionalCount}</div>
                          <div className="text-xs text-text-secondary">Conditional</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gray-500/10">
                          <div className="text-2xl font-bold text-gray-500">{result.abstainCount}</div>
                          <div className="text-xs text-text-secondary">Abstain</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Deliberations */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Deliberations</h3>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {deliberations.map((d, i) => (
                        <div key={i} className="p-4 rounded-lg bg-accent/5 border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-semibold text-sm">{d.agentName}</div>
                            <Badge variant="outline" className="text-xs">
                              {d.phase}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-secondary mb-2">{d.content}</p>
                          {d.citedLaws.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {d.citedLaws.map((law, j) => (
                                <Badge key={j} variant="outline" className="text-xs">
                                  {law}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Votes */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Individual Votes</h3>
                  <div className="space-y-3">
                    {votes.map((v, i) => (
                      <div key={i} className="p-4 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-sm">{v.agentName}</div>
                          <Badge
                            variant={v.vote === "approve" ? "default" : "outline"}
                            className={`text-xs ${
                              v.vote === "approve"
                                ? "bg-green-500"
                                : v.vote === "reject"
                                  ? "bg-red-500"
                                  : v.vote === "conditional"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                            }`}
                          >
                            {v.vote.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary mb-1">{v.reasoning}</p>
                        <div className="text-xs text-text-secondary">
                          Confidence: {(v.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
