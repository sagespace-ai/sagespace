"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Send, AlertCircle, ArrowLeft } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  role: string
  status: "active" | "idle" | "thinking"
  purpose: string
  harmonyScore: number
  ethicsAlignment: number
}

interface ChatMessage {
  id: string
  sender: "user" | "agent"
  content: string
  timestamp: Date
  requiresApproval?: boolean
}

export default function ChatPage() {
  const params = useParams()
  const agentId = params.id as string

  const [agent, setAgent] = useState<Agent | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch("/api/agents")

        if (!res.ok) {
          throw new Error(`Failed to fetch agents: ${res.statusText}`)
        }

        const agents = await res.json()
        const selectedAgent = agents.find((a: Agent) => a.id === agentId)
        setAgent(selectedAgent)

        if (selectedAgent) {
          try {
            const welcomeRes = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                agentId: selectedAgent.id,
                message: "Hello! Please introduce yourself.",
                threadId: null,
              }),
            })

            if (welcomeRes.ok) {
              const welcomeData = await welcomeRes.json()
              setThreadId(welcomeData.threadId)

              setMessages([
                {
                  id: "welcome",
                  sender: "agent",
                  content: welcomeData.response,
                  timestamp: new Date(),
                },
              ])
            } else {
              // Fallback welcome message if AI chat is not configured
              setMessages([
                {
                  id: "welcome",
                  sender: "agent",
                  content: `Hello! I'm ${selectedAgent.name}, your ${selectedAgent.role}. ${
                    selectedAgent.purpose || "I'm here to assist you."
                  } How can I help you today?`,
                  timestamp: new Date(),
                },
              ])
            }
          } catch (chatError) {
            console.error("Chat API error, using fallback:", chatError)
            // Fallback welcome message
            setMessages([
              {
                id: "welcome",
                sender: "agent",
                content: `Hello! I'm ${selectedAgent.name}, your ${selectedAgent.role}. ${
                  selectedAgent.purpose || "I'm here to assist you."
                } How can I help you today?`,
                timestamp: new Date(),
              },
            ])
          }
        }
      } catch (error) {
        console.error("Error fetching agent:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [agentId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !agent || sending) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setSending(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          message: inputValue,
          threadId,
        }),
      })

      if (res.ok) {
        const data = await res.json()

        if (data.threadId) {
          setThreadId(data.threadId)
        }

        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          content: data.response,
          timestamp: new Date(),
          requiresApproval: data.requiresApproval,
        }

        setMessages((prev) => [...prev, agentMessage])
      } else {
        // Fallback response if AI is not configured
        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          content: `Thank you for your message. As ${agent.name}, I acknowledge your input: "${inputValue}". To enable full AI-powered conversations, please configure the GROQ_API_KEY in your environment variables.`,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, agentMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          content: `Thank you for reaching out. I'm ${agent.name}, and while I understand your message, full AI responses require additional configuration. Please ensure the LangChain integration is properly set up.`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background cosmic-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background cosmic-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-text-secondary">Agent not found</p>
          <Link href="/demo" className="text-primary hover:text-accent transition-colors">
            Return to Universe
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background cosmic-gradient">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(124,93,255,0.05)_1px,transparent_1px),linear-gradient(rgba(124,93,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative flex flex-col h-screen max-w-4xl mx-auto">
        {/* Header */}
        <AppHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/demo" className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-text-secondary" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">{agent.name}</h1>
                <p className="text-sm text-text-secondary">{agent.role}</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span
                className={`px-3 py-1 rounded-full ${
                  agent.status === "active" ? "bg-success/20 text-success" : "bg-text-muted/20 text-text-secondary"
                }`}
              >
                {agent.status}
              </span>
            </div>
          </div>
        </AppHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-primary/40 to-accent/40 text-foreground rounded-br-none"
                    : "glass border border-border/30 text-text-secondary rounded-bl-none"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.requiresApproval && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-warning">
                    <AlertCircle className="w-3 h-3" />
                    <span>This action requires approval</span>
                  </div>
                )}
                <p className="text-xs mt-2 opacity-60">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="glass border border-border/30 px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/20 glass p-6 sticky bottom-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message your sage..."
              className="flex-1 bg-muted border border-border/30 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || sending}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
