"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  SparklesIcon as Sparkles,
  SendIcon as Send,
  Loader2Icon as Loader2,
  ZapIcon as Zap,
  BrainIcon as Brain,
  PaletteIcon as Palette,
  ShieldIcon as Shield,
  HomeIcon as Home,
  ChevronDown,
  UsersIcon as Users,
  EyeIcon as Eye,
  ScaleIcon as Scale,
  MenuIcon as Menu,
} from "@/components/icons"
import Link from "next/link"

const QUICK_START_AGENTS = [
  {
    id: "ethics-advisor",
    name: "Ethics Advisor",
    role: "Ethical Guidance",
    description: "Navigate moral dilemmas with wisdom from the Five Laws",
    avatar: "🧘",
    color: "from-purple-500 to-blue-500",
    icon: Shield,
    prompt: "How should I handle an ethical dilemma at work?",
  },
  {
    id: "quantum-researcher",
    name: "Quantum Researcher",
    role: "Scientific Analysis",
    description: "Explore quantum physics and complex scientific concepts",
    avatar: "⚛️",
    color: "from-blue-500 to-cyan-500",
    icon: Brain,
    prompt: "Explain quantum entanglement in simple terms",
  },
  {
    id: "creative-artist",
    name: "Creative Artist",
    role: "Creative Exploration",
    description: "Generate innovative ideas and artistic perspectives",
    avatar: "🎨",
    color: "from-pink-500 to-orange-500",
    icon: Palette,
    prompt: "Help me brainstorm a creative project idea",
  },
]

const AI_MODELS = [
  {
    id: "grok-3",
    name: "xAI Grok 3",
    provider: "xai",
    description: "Fast and powerful reasoning",
    available: true, // Always available with GROK_XAI_API_KEY
  },
  {
    id: "gpt-4o",
    name: "ChatGPT 4o",
    provider: "openai",
    description: "Most capable OpenAI model",
    available: true, // Now available with OPENAI_API_KEY
    requiresKey: false,
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    description: "Anthropic's most intelligent model",
    available: false, // Still requires ANTHROPIC_API_KEY
    requiresKey: true,
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "groq",
    description: "Meta's open source model via Groq",
    available: true, // Now available with GROQ_API_KEY
    requiresKey: false,
  },
  {
    id: "best-available",
    name: "Best Available",
    provider: "auto",
    description: "Automatically selects the best model",
    available: true,
  },
]

type Message = {
  role: "user" | "assistant" | "collaboration"
  content: string
  collaboration?: {
    messages: Array<{ fromAgentName: string; content: string; messageType: string }>
    confidence: number
  }
}

export default function PlaygroundPage() {
  const [selectedAgent, setSelectedAgent] = useState(QUICK_START_AGENTS[0])
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0])
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showNavMenu, setShowNavMenu] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [enableCollaboration, setEnableCollaboration] = useState(true)

  const handleAgentChange = (agent: (typeof QUICK_START_AGENTS)[0]) => {
    setSelectedAgent(agent)
    setMessages([])
    setShowWelcome(true)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    setShowWelcome(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setShowWelcome(false)
    setIsLoading(true)

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }]
    setMessages(newMessages)

    let assistantMessageContent = ""
    const assistantMessageIndex = newMessages.length

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          agentId: selectedAgent.id,
          agentName: selectedAgent.name,
          agentRole: selectedAgent.role,
          model: selectedModel.id,
          provider: selectedModel.provider,
          enableCollaboration,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const data = await response.json()
        if (data.type === "collaboration") {
          console.log("[v0] Received collaboration response")
          setMessages((prev) => [
            ...prev,
            {
              role: "collaboration",
              content: data.outcome,
              collaboration: {
                messages: data.messages,
                confidence: data.confidence,
              },
            },
          ])
          setIsLoading(false)
          return
        }
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim()
              if (data === "[DONE]") continue
              if (!data) continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.type === "text-delta" && parsed.textDelta) {
                  assistantMessageContent += parsed.textDelta
                  setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages]
                    if (updatedMessages[assistantMessageIndex]?.role === "assistant") {
                      updatedMessages[assistantMessageIndex].content = assistantMessageContent
                    } else {
                      updatedMessages.push({ role: "assistant", content: assistantMessageContent })
                    }
                    return updatedMessages
                  })
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please check your API configuration.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const AgentIcon = selectedAgent.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-accent/10 px-2 md:px-3">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Universe</span>
              </Button>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-accent" />
              <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Playground
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Observatory and Council buttons - always visible */}
            <Link href="/observatory" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-accent/10">
                <Eye className="w-4 h-4" />
                <span className="hidden lg:inline">Observatory</span>
              </Button>
            </Link>
            <Link href="/council" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-accent/10">
                <Scale className="w-4 h-4" />
                <span className="hidden lg:inline">Council</span>
              </Button>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <Button
              variant={enableCollaboration ? "default" : "ghost"}
              size="sm"
              onClick={() => setEnableCollaboration(!enableCollaboration)}
              className="gap-1.5 text-xs px-2 md:px-3"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{enableCollaboration ? "ON" : "OFF"}</span>
            </Button>
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-card/50 border border-border/50 hover:bg-card hover:border-border transition-all text-xs md:text-sm"
              >
                <Brain className="w-3.5 h-3.5 text-accent" />
                <span className="font-medium hidden lg:inline">{selectedModel.name}</span>
                <span className="font-medium lg:hidden">Model</span>
                <ChevronDown className="w-3 h-3 text-text-secondary" />
              </button>
              {showModelDropdown && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model)
                          setShowModelDropdown(false)
                        }}
                        disabled={!model.available}
                        className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                          selectedModel.id === model.id
                            ? "bg-accent text-accent-foreground"
                            : model.available
                              ? "hover:bg-accent/10"
                              : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{model.name}</div>
                            <div className="text-xs text-text-secondary">{model.description}</div>
                          </div>
                          {!model.available && model.requiresKey && (
                            <Badge variant="outline" className="text-xs">
                              API Key Required
                            </Badge>
                          )}
                          {model.available && <Badge className="text-xs bg-green-500">Available</Badge>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNavMenu(!showNavMenu)}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg bg-card/50 border border-border/50 hover:bg-card hover:border-border transition-all"
              >
                <Menu className="w-4 h-4" />
              </button>
              {showNavMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    <Link href="/observatory" className="block sm:hidden">
                      <button
                        onClick={() => setShowNavMenu(false)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/10 transition-all flex items-center gap-3"
                      >
                        <Eye className="w-4 h-4 text-accent" />
                        <div>
                          <div className="text-sm font-medium">Observatory</div>
                          <div className="text-xs text-text-secondary">Watch agents interact</div>
                        </div>
                      </button>
                    </Link>
                    <Link href="/council" className="block sm:hidden">
                      <button
                        onClick={() => setShowNavMenu(false)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/10 transition-all flex items-center gap-3"
                      >
                        <Scale className="w-4 h-4 text-accent" />
                        <div>
                          <div className="text-sm font-medium">Council</div>
                          <div className="text-xs text-text-secondary">Agent deliberation</div>
                        </div>
                      </button>
                    </Link>
                    <div className="border-t border-border my-1 sm:hidden" />
                    <Link href="/memory" className="block">
                      <button
                        onClick={() => setShowNavMenu(false)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/10 transition-all flex items-center gap-3"
                      >
                        <Brain className="w-4 h-4 text-accent" />
                        <div>
                          <div className="text-sm font-medium">Memory</div>
                          <div className="text-xs text-text-secondary">Agent learning</div>
                        </div>
                      </button>
                    </Link>
                    <div className="border-t border-border my-1" />
                    <Link href="/marketplace" className="block">
                      <button
                        onClick={() => setShowNavMenu(false)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent/10 transition-all flex items-center gap-3"
                      >
                        <Zap className="w-4 h-4 text-accent" />
                        <div>
                          <div className="text-sm font-medium">Templates</div>
                          <div className="text-xs text-text-secondary">Browse 50+ agents</div>
                        </div>
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="text-sm font-medium text-text-secondary mb-3">Choose Your Sage</div>
            {QUICK_START_AGENTS.map((agent) => {
              const Icon = agent.icon
              const isSelected = selectedAgent.id === agent.id
              return (
                <button
                  key={agent.id}
                  onClick={() => handleAgentChange(agent)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${agent.color} text-white shadow-lg scale-105`
                      : "bg-card hover:bg-card/80 hover:scale-102 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{agent.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-sm mb-1 ${isSelected ? "text-white" : "text-foreground"}`}>
                        {agent.name}
                      </div>
                      <div className={`text-xs mb-2 ${isSelected ? "text-white/90" : "text-text-secondary"}`}>
                        {agent.description}
                      </div>
                      <Badge variant={isSelected ? "secondary" : "outline"} className="text-xs gap-1">
                        <Icon className="w-3 h-3" />
                        {agent.role}
                      </Badge>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="lg:col-span-9">
            <Card className="flex flex-col h-[calc(100vh-10rem)] shadow-xl">
              <div className={`p-4 border-b border-border bg-gradient-to-r ${selectedAgent.color}`}>
                <div className="flex items-center gap-3 text-white">
                  <div className="text-2xl">{selectedAgent.avatar}</div>
                  <div className="flex-1">
                    <div className="font-bold">{selectedAgent.name}</div>
                    <div className="text-sm text-white/80">{selectedAgent.role}</div>
                  </div>
                  <AgentIcon className="w-5 h-5 text-white/80" />
                </div>
              </div>
              <ScrollArea className="flex-1 p-6">
                {showWelcome && messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-4xl mb-6 shadow-lg`}
                    >
                      {selectedAgent.avatar}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Chat with {selectedAgent.name}</h2>
                    <p className="text-text-secondary mb-8">{selectedAgent.description}</p>
                    <div className="w-full space-y-3">
                      <div className="text-sm font-medium text-text-secondary mb-2">Try asking:</div>
                      <button
                        onClick={() => handleQuickPrompt(selectedAgent.prompt)}
                        className="w-full p-4 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/20 text-left transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                          <span className="text-sm">{selectedAgent.prompt}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, i) => (
                      <div key={i} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                        {message.role === "assistant" && (
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-xl shrink-0 shadow-md`}
                          >
                            {selectedAgent.avatar}
                          </div>
                        )}
                        {message.role === "collaboration" && (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0 shadow-md">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? "bg-accent text-accent-foreground shadow-md"
                              : "bg-card border border-border shadow-sm"
                          }`}
                        >
                          {message.role === "collaboration" && (
                            <div className="mb-2">
                              <Badge className="gap-1 bg-purple-500">
                                <Users className="w-3 h-3" />
                                Multi-Agent Collaboration
                              </Badge>
                            </div>
                          )}
                          {(message.role === "assistant" || message.role === "collaboration") && (
                            <div className="text-xs text-accent font-semibold mb-1">
                              {message.role === "collaboration" ? "Council Response" : selectedAgent.name}
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          {message.collaboration && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <div className="text-xs font-semibold text-text-secondary mb-2">
                                {message.collaboration.messages.length} agents collaborated
                              </div>
                              <div className="space-y-2">
                                {message.collaboration.messages.slice(0, 3).map((collab, j) => (
                                  <div key={j} className="text-xs p-2 rounded bg-accent/5">
                                    <span className="font-semibold">{collab.fromAgentName}:</span>{" "}
                                    {collab.content.substring(0, 100)}...
                                  </div>
                                ))}
                              </div>
                              <div className="text-xs text-text-secondary mt-2">
                                Confidence: {(message.collaboration.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          )}
                        </div>
                        {message.role === "user" && (
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 shadow-sm">
                            <span className="text-xl">👤</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="p-4 border-t border-border bg-card/50">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask ${selectedAgent.name} anything...`}
                    disabled={isLoading}
                    className="flex-1 h-12 text-base"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} className="h-12 px-6 gap-2" size="lg">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
