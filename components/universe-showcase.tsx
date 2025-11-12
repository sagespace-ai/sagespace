"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GovernanceDashboard } from "./governance-dashboard"
import {
  SearchIcon,
  PlusIcon,
  TrendingUpIcon,
  UsersIcon,
  MessageSquareIcon,
  SparklesIcon,
  NetworkIcon,
  ClockIcon,
  ShieldIcon,
} from "@/components/icons"
import { CreateSageModal } from "./create-sage-modal"
import { StatDetailModal } from "./stat-detail-modal"
import { EditSageModal } from "./edit-sage-modal"
import { EditIcon, Trash2Icon, MoreVerticalIcon, SendIcon, Loader2Icon } from "@/components/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Agent {
  id: string
  name: string
  role: string
  status: "active" | "idle" | "learning"
  purpose: string
  createdAt: string | Date
  harmonyScore: number
  ethicsAlignment: number
  tone?: string
  modality?: string
  capabilities?: string
  model?: string
}

interface Conversation {
  id: string
  title: string
  agents: string[]
  messageCount: number
  createdAt: string | Date
  ethicsReview: "passed" | "pending" | "flagged"
}

interface TimelineEvent {
  id: string
  type: "spawn" | "interaction" | "learning" | "governance" | "conversation_started" | "agent_joined" | "message"
  title: string
  description: string
  timestamp: string | Date
}

interface Setting {
  id: string
  name: string
  category: string
  value: string | boolean | number
  description: string
}

interface Message {
  role: "user" | "assistant"
  content: string
  agentName?: string
}

export function UniverseShowcase() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<"agents" | "universe" | "timeline" | "governance">("agents")

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ethicsFilter, setEthicsFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [statModalOpen, setStatModalOpen] = useState(false)
  const [statModalType, setStatModalType] = useState<
    "total" | "active" | "interactions" | "messages" | "harmony" | "ethics"
  >("total")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatAgent, setChatAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, convsRes, timelineRes, settingsRes] = await Promise.all([
          fetch("/api/agents"),
          fetch("/api/conversations"),
          fetch("/api/timeline"),
          fetch("/api/settings"),
        ])

        const agentsData = agentsRes.ok ? await agentsRes.json() : []
        const convsData = convsRes.ok ? await convsRes.json() : []
        const timelineData = timelineRes.ok ? await timelineRes.json() : []
        const settingsData = settingsRes.ok ? await settingsRes.json() : []

        setAgents(Array.isArray(agentsData) ? agentsData : [])
        setConversations(Array.isArray(convsData) ? convsData : [])
        setTimeline(Array.isArray(timelineData) ? timelineData : [])
        setSettings(Array.isArray(settingsData) ? settingsData : [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setAgents([])
        setConversations([])
        setTimeline([])
        setSettings([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "idle":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      case "learning":
        return "bg-violet-500/20 text-violet-400 border-violet-500/30"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const getEthicsStatus = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-success/20 text-success border-success/30"
      case "pending":
        return "bg-warning/20 text-warning border-warning/30"
      case "flagged":
        return "bg-error/20 text-error border-error/30"
      default:
        return "bg-border/20 text-text-secondary"
    }
  }

  const handleSettingChange = (settingId: string, newValue: string | boolean | number) => {
    console.log(`[v0] Setting ${settingId} updated to:`, newValue)
  }

  const refreshAgents = async () => {
    try {
      const response = await fetch("/api/agents")
      if (response.ok) {
        const data = await response.json()
        setAgents(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error refreshing agents:", error)
    }
  }

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter((a) => a.status === "active").length,
    totalConversations: conversations.length,
    totalMessages: conversations.reduce((sum, c) => sum + (c.messageCount || 0), 0),
    avgHarmony: agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.harmonyScore, 0) / agents.length) : 0,
    avgEthics:
      agents.length > 0 ? Math.round(agents.reduce((sum, a) => sum + a.ethicsAlignment, 0) / agents.length) : 0,
  }

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEthics = ethicsFilter === "all" || conv.ethicsReview === ethicsFilter
    return matchesSearch && matchesEthics
  })

  const handleEditAgent = (agent: Agent, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedAgent(agent)
    setEditModalOpen(true)
  }

  const handleDeleteAgent = (agent: Agent, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedAgent(agent)
    setDeleteConfirmOpen(true)
  }

  const handleChatWithAgent = (agent: Agent, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setChatAgent(agent)
    setMessages([])
    setChatOpen(true)
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isChatLoading || !chatAgent) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          agentId: chatAgent.id,
          agentName: chatAgent.name,
          agentRole: chatAgent.role,
        }),
      })

      if (!response.ok) throw new Error("Chat failed")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      setMessages((prev) => [...prev, { role: "assistant", content: "", agentName: chatAgent.name }])

      while (true) {
        const { done, value } = (await reader?.read()) ?? { done: true }
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1].content = assistantMessage
          return updated
        })
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please check your API configuration.",
          agentName: chatAgent.name,
        },
      ])
    } finally {
      setIsChatLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedAgent) return

    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete sage")

      setDeleteConfirmOpen(false)
      await refreshAgents()
    } catch (error) {
      console.error("Error deleting sage:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <div className="relative inline-flex">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-40 blur-2xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">Initializing Universe</p>
            <p className="text-slate-400">Loading your sage civilization...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            SageSpace
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/playground">
              <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/25">
                <SparklesIcon className="w-4 h-4 mr-2" />
                AI Playground
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white bg-transparent">
                Browse 50 Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <CreateSageModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSuccess={refreshAgents} />
      <EditSageModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        agent={selectedAgent}
        onSuccess={refreshAgents}
      />
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-slate-900 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">Delete Sage</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete "{selectedAgent?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="flex-1 border-white/20 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <StatDetailModal
        open={statModalOpen}
        onOpenChange={setStatModalOpen}
        type={statModalType}
        agents={agents}
        conversations={conversations}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-slate-900 border-l border-white/10 transform transition-transform duration-300 z-50 ${
          chatOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {chatAgent && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-violet-600 to-fuchsia-600">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <div className="font-bold">{chatAgent.name}</div>
                    <div className="text-sm text-white/80">{chatAgent.role}</div>
                  </div>
                </div>
                <Button
                  onClick={() => setChatOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-4xl mb-6">
                    🤖
                  </div>
                  <h2 className="text-xl font-bold mb-2">Chat with {chatAgent.name}</h2>
                  <p className="text-slate-400 mb-6">{chatAgent.purpose}</p>
                  <p className="text-sm text-violet-400">Start a conversation below</p>
                </div>
              ) : (
                messages.map((message, i) => (
                  <div key={i} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                    {message.role === "assistant" && (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xl shrink-0">
                        🤖
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-violet-600 text-white"
                          : "bg-slate-800 border border-white/10 text-white"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="text-xs text-violet-400 font-semibold mb-1">{message.agentName}</div>
                      )}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                        <span className="text-xl">👤</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-slate-800/50">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder={`Ask ${chatAgent.name} anything...`}
                  disabled={isChatLoading}
                  className="flex-1 bg-slate-900 border-white/10 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isChatLoading || !input.trim()}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
                >
                  {isChatLoading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 p-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-fuchsia-600/0 group-hover:from-violet-600/10 group-hover:to-fuchsia-600/10 transition-colors" />
              <div className="relative space-y-2">
                <UsersIcon className="w-8 h-8 text-violet-400" />
                <div>
                  <div className="text-4xl font-bold text-white">{stats.totalAgents}</div>
                  <div className="text-sm text-violet-300">Total Sages</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 p-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-teal-600/0 group-hover:from-emerald-600/10 group-hover:to-teal-600/10 transition-colors" />
              <div className="relative space-y-2">
                <TrendingUpIcon className="w-8 h-8 text-emerald-400" />
                <div>
                  <div className="text-4xl font-bold text-white">{stats.activeAgents}</div>
                  <div className="text-sm text-emerald-300">Active Now</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 p-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 transition-colors" />
              <div className="relative space-y-2">
                <MessageSquareIcon className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-4xl font-bold text-white">{stats.totalConversations}</div>
                  <div className="text-sm text-blue-300">Interactions</div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 p-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 to-orange-600/0 group-hover:from-amber-600/10 group-hover:to-orange-600/10 transition-colors" />
              <div className="relative space-y-2">
                <ClockIcon className="w-8 h-8 text-amber-400" />
                <div>
                  <div className="text-4xl font-bold text-white">{stats.totalMessages}</div>
                  <div className="text-sm text-amber-300">Messages</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {[
              { key: "agents", label: "Sages", icon: UsersIcon },
              { key: "universe", label: "Universe", icon: NetworkIcon },
              { key: "timeline", label: "Timeline", icon: ClockIcon },
              { key: "governance", label: "Governance", icon: ShieldIcon },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as any)}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeSection === key
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 scale-105"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 inline mr-2" />
                {label}
              </button>
            ))}
          </div>

          {activeSection === "agents" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search sages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 bg-white/5 border-white/10 focus:border-violet-500/50 rounded-xl h-12 text-white placeholder:text-slate-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500/50 text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="learning">Learning</option>
                </select>

                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-500/25 h-12 px-6"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  New Sage
                </Button>
              </div>

              {filteredAgents.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredAgents.map((agent) => (
                    <div key={agent.id} className="group relative">
                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-black/50 backdrop-blur-sm border border-white/10"
                            >
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            <DropdownMenuItem
                              onClick={(e) => handleChatWithAgent(agent, e as any)}
                              className="cursor-pointer"
                            >
                              <MessageSquareIcon className="mr-2 h-4 w-4" />
                              Chat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleEditAgent(agent, e as any)}
                              className="cursor-pointer"
                            >
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleDeleteAgent(agent, e as any)}
                              className="cursor-pointer text-red-400"
                            >
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Link href={`/chat/${agent.id}`}>
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all group-hover:scale-[1.02] cursor-pointer">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-2xl" />

                          <div className="relative space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors">
                                  {agent.name}
                                </h3>
                                <p className="text-violet-400 font-medium">{agent.role}</p>
                              </div>
                              <Badge
                                className={`${getStatusColor(agent.status)} rounded-full px-3 py-1 text-xs font-semibold`}
                              >
                                {agent.status}
                              </Badge>
                            </div>

                            <p className="text-slate-300 leading-relaxed">{agent.purpose}</p>

                            <div className="space-y-3 pt-4">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-slate-400">Harmony</span>
                                  <span className="text-sm font-bold text-violet-400">{agent.harmonyScore}%</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                                    style={{ width: `${agent.harmonyScore}%` }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-slate-400">Ethics</span>
                                  <span className="text-sm font-bold text-emerald-400">{agent.ethicsAlignment}%</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    style={{ width: `${agent.ethicsAlignment}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 pt-2">Spawned {formatDate(agent.createdAt)}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 rounded-2xl bg-white/5 border border-white/10">
                  <UsersIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <p className="text-xl font-semibold text-white mb-2">No sages found</p>
                  <p className="text-slate-400 mb-6">Create your first sage to begin</p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Sage
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeSection === "universe" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="relative w-full aspect-square max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-8 overflow-hidden group">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-20 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 blur-3xl animate-pulse"></div>
                </div>

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
                    stroke="rgba(139, 92, 246, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="80"
                    fill="none"
                    stroke="rgba(217, 70, 239, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="160"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.1)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                </svg>

                {agents.length > 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-2xl max-h-2xl">
                      {agents.slice(0, 12).map((agent, idx) => {
                        const angle = (idx / Math.min(agents.length, 12)) * 360
                        const radius = 100 + (idx % 3) * 60
                        const x = Math.cos((angle * Math.PI) / 180) * radius
                        const y = Math.sin((angle * Math.PI) / 180) * radius

                        return (
                          <div
                            key={agent.id}
                            className="absolute w-16 h-16 transition-all duration-500 cursor-pointer hover:scale-125 group/sphere"
                            style={{
                              left: "50%",
                              top: "50%",
                              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                            }}
                            onClick={() => {
                              if (chatOpen && chatAgent?.id === agent.id) {
                                setChatOpen(false)
                              } else {
                                setChatAgent(agent)
                                setChatOpen(true)
                                setMessages([])
                              }
                            }}
                          >
                            <div className="relative w-full h-full rounded-full transition-all duration-300">
                              <div
                                className="absolute inset-0 rounded-full opacity-60 blur-xl"
                                style={{
                                  background:
                                    agent.status === "active"
                                      ? "rgba(16, 185, 129, 0.6)"
                                      : agent.status === "learning"
                                        ? "rgba(217, 70, 239, 0.6)"
                                        : "rgba(139, 92, 246, 0.4)",
                                }}
                              ></div>

                              <div
                                className={`relative w-full h-full rounded-full border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                                  agent.status === "active"
                                    ? "bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 border-emerald-500/50"
                                    : agent.status === "learning"
                                      ? "bg-gradient-to-br from-fuchsia-500/30 to-fuchsia-500/10 border-fuchsia-500/50"
                                      : "bg-gradient-to-br from-violet-500/30 to-violet-500/10 border-violet-500/50"
                                }`}
                              >
                                <span className="drop-shadow-lg">{agent.name.charAt(0)}</span>
                              </div>
                            </div>

                            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/sphere:opacity-100 transition-opacity pointer-events-none z-50">
                              <div className="bg-slate-900 border border-white/20 rounded-xl p-4 shadow-2xl shadow-violet-500/20 min-w-[280px]">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-white text-lg">{agent.name}</h4>
                                    <Badge className={`${getStatusColor(agent.status)} text-xs`}>{agent.status}</Badge>
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Role:</span>
                                      <span className="text-violet-400 font-medium">{agent.role}</span>
                                    </div>

                                    {agent.tone && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Tone:</span>
                                        <span className="text-white">{agent.tone}</span>
                                      </div>
                                    )}

                                    {agent.modality && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Modality:</span>
                                        <span className="text-white">{agent.modality}</span>
                                      </div>
                                    )}

                                    {agent.capabilities && (
                                      <div>
                                        <span className="text-slate-400 block mb-1">Capabilities:</span>
                                        <span className="text-white text-xs">{agent.capabilities}</span>
                                      </div>
                                    )}

                                    {agent.model && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-400">Model:</span>
                                        <span className="text-emerald-400 font-mono text-xs">{agent.model}</span>
                                      </div>
                                    )}

                                    {agent.purpose && (
                                      <div>
                                        <span className="text-slate-400 block mb-1">Purpose:</span>
                                        <p className="text-white text-xs leading-relaxed">{agent.purpose}</p>
                                      </div>
                                    )}

                                    <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                                      <div>
                                        <div className="text-xs text-slate-400">Harmony</div>
                                        <div className="text-violet-400 font-bold">{agent.harmonyScore}%</div>
                                      </div>
                                      <div>
                                        <div className="text-xs text-slate-400">Ethics</div>
                                        <div className="text-emerald-400 font-bold">{agent.ethicsAlignment}%</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center border-2 border-violet-500/30">
                        <NetworkIcon className="w-10 h-10 text-violet-400" />
                      </div>
                      <p className="text-slate-400">No sages in your universe yet</p>
                      <Button
                        onClick={() => {
                          setActiveSection("agents")
                          setIsCreateModalOpen(true)
                        }}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create First Sage
                      </Button>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/50 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "timeline" && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {timeline.length > 0 ? (
                timeline.map((event, idx) => (
                  <div key={event.id} className="flex gap-4">
                    {idx < timeline.length - 1 && (
                      <div className="absolute left-[19px] top-16 w-0.5 h-12 bg-gradient-to-b from-violet-500/50 to-transparent" />
                    )}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 border-2 border-violet-500/50 flex items-center justify-center text-lg z-10">
                      ✨
                    </div>
                    <div className="flex-1 rounded-xl bg-slate-900/50 border border-white/10 p-4">
                      <h4 className="font-bold text-white mb-1">{event.title}</h4>
                      <p className="text-sm text-slate-400 mb-2">{event.description}</p>
                      <p className="text-xs text-slate-500">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400">No timeline events yet</div>
              )}
            </div>
          )}

          {activeSection === "governance" && (
            <div className="animate-in fade-in duration-500">
              <GovernanceDashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
