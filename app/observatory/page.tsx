"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  EyeIcon as Eye,
  ActivityIcon as Activity,
  UsersIcon as Users,
  MessageSquareIcon as MessageSquare,
  PlayIcon as Play,
  PauseIcon as Pause,
  ZapIcon as Zap,
  AlertTriangleIcon as AlertTriangle,
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
  status: "active" | "idle" | "thinking"
  avatar?: string
  harmony_score?: number
  ethics_alignment?: number
}

type AgentConversation = {
  id: string
  title: string
  status: string
  trigger_type: string
  created_at: string
}

type AgentMessage = {
  id: string
  from_agent_id: string
  to_agent_id: string | null
  message_type: string
  content: string
  created_at: string
  agents?: { name: string; role: string }
}

type AgentInteraction = {
  id: string
  agent_a_id: string
  agent_b_id: string
  interaction_type: string
  outcome: string
  confidence: number
  created_at: string
}

export default function ObservatoryPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [conversations, setConversations] = useState<AgentConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [interactions, setInteractions] = useState<AgentInteraction[]>([])
  const [isLive, setIsLive] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchAgents()
    fetchConversations()
    const interval = setInterval(() => {
      if (isLive) {
        fetchConversations()
        if (selectedConversation) {
          fetchConversationDetails(selectedConversation)
        }
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isLive, selectedConversation])

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents")
      const data = await res.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error("Failed to fetch agents:", error)
    }
  }

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/observatory/conversations")
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    }
  }

  const fetchConversationDetails = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/observatory/conversations?id=${conversationId}`)
      const data = await res.json()
      setMessages(data.messages || [])
      setInteractions(data.interactions || [])
    } catch (error) {
      console.error("Failed to fetch conversation details:", error)
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    fetchConversationDetails(conversationId)
  }

  const handleIntervene = async () => {
    if (!selectedConversation) return
    // Placeholder for intervention logic
    alert("Intervention feature coming soon - you can pause/modify agent conversations")
  }

  const deleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchAgents()
      }
    } catch (error) {
      console.error("Failed to delete agent:", error)
    }
  }

  const getAgentById = (id: string) => agents.find((a) => a.id === id)

  const filteredConversations = conversations.filter((conv) => {
    if (filter === "all") return true
    if (filter === "active") return conv.status === "active"
    if (filter === "completed") return conv.status === "completed"
    return true
  })

  const activeAgents = agents.filter((a) => a.status === "active" || a.status === "thinking")

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
              <Eye className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Agent Observatory
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AgentManagerDialog onAgentCreated={fetchAgents} />
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
            <Badge variant="outline" className="gap-2">
              <Activity className="w-4 h-4" />
              {activeAgents.length} active
            </Badge>
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="gap-2"
            >
              {isLive ? (
                <>
                  <Pause className="w-4 h-4" />
                  Live
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Paused
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Active Agents */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Active Agents
              </h2>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-3 rounded-lg border transition-all ${
                        agent.status === "active" || agent.status === "thinking"
                          ? "border-accent bg-accent/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="text-xl">{agent.avatar || "🤖"}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs">{agent.name}</div>
                          <div className="text-xs text-text-secondary">{agent.role}</div>
                          <Badge variant={agent.status === "active" ? "default" : "outline"} className="text-xs mt-1">
                            {agent.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                          {(agent.status === "active" || agent.status === "thinking") && (
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAgent(agent.id)}
                            className="h-6 w-6 p-0 hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Conversation Stats */}
            <Card className="p-4">
              <h3 className="text-sm font-bold mb-3">Real-Time Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Total Conversations</span>
                  <span className="text-lg font-bold">{conversations.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Active Now</span>
                  <span className="text-lg font-bold text-green-500">
                    {conversations.filter((c) => c.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Messages Exchanged</span>
                  <span className="text-lg font-bold">{messages.length}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Conversations List */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Conversations
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className="text-xs"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("active")}
                    className="text-xs"
                  >
                    Active
                  </Button>
                  <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("completed")}
                    className="text-xs"
                  >
                    Done
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedConversation === conv.id
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="font-semibold text-sm truncate">{conv.title}</div>
                        <Badge variant={conv.status === "active" ? "default" : "outline"} className="text-xs shrink-0">
                          {conv.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {conv.trigger_type}
                        </Badge>
                        <span className="text-xs text-text-secondary">
                          {new Date(conv.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </button>
                  ))}
                  {filteredConversations.length === 0 && (
                    <div className="text-center py-8 text-text-secondary">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No conversations yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Conversation Details */}
          <div className="lg:col-span-5 space-y-4">
            {selectedConversation ? (
              <>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Message Flow</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleIntervene} className="gap-2 bg-transparent">
                        <AlertTriangle className="w-4 h-4" />
                        Intervene
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {messages.map((msg, idx) => {
                        const fromAgent = getAgentById(msg.from_agent_id)
                        const toAgent = msg.to_agent_id ? getAgentById(msg.to_agent_id) : null
                        return (
                          <div
                            key={msg.id}
                            className="p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-all"
                          >
                            <div className="flex items-start gap-3 mb-2">
                              <div className="text-xl">{fromAgent?.avatar || "🤖"}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">{fromAgent?.name || "Unknown"}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {msg.message_type}
                                  </Badge>
                                </div>
                                {toAgent && (
                                  <div className="text-xs text-text-secondary mb-2">
                                    → {toAgent.name} ({toAgent.role})
                                  </div>
                                )}
                                <p className="text-sm text-text-secondary leading-relaxed">
                                  {msg.content.substring(0, 200)}
                                  {msg.content.length > 200 && "..."}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-text-secondary">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </Card>

                {/* Interaction Graph */}
                <Card className="p-4">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    Agent Interactions
                  </h3>
                  <div className="space-y-2">
                    {interactions.map((interaction) => {
                      const agentA = getAgentById(interaction.agent_a_id)
                      const agentB = getAgentById(interaction.agent_b_id)
                      return (
                        <div key={interaction.id} className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">{agentA?.name}</span>
                            <span className="text-xs text-text-secondary">↔</span>
                            <span className="text-sm font-medium">{agentB?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {interaction.interaction_type}
                            </Badge>
                            <span className="text-xs text-text-secondary">
                              {(interaction.confidence * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    {interactions.length === 0 && (
                      <div className="text-center py-4 text-text-secondary text-xs">No interactions recorded</div>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
                  <p className="text-text-secondary">Select a conversation to observe agent interactions</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
