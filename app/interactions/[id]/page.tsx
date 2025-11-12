"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  role: "user" | "assistant"
}

interface Conversation {
  id: string
  title: string
  agents: string[]
  messageCount: number
  createdAt: string
  ethicsReview: "passed" | "pending" | "flagged"
}

export default function InteractionPage({ params }: { params: { id: string } }) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await fetch(`/api/conversations/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setConversation(data)
        }
      } catch (error) {
        console.error("Error fetching conversation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversation()
  }, [params.id])

  // Mock messages for now - in production these would come from the API
  useEffect(() => {
    setMessages([
      {
        id: "1",
        sender: "Claude Assistant",
        content: "Let's explore the latest React Hooks patterns and best practices.",
        timestamp: "10:30 AM",
        role: "assistant",
      },
      {
        id: "2",
        sender: "Code Writer",
        content: "Great! Should we focus on useEffect optimization first?",
        timestamp: "10:32 AM",
        role: "assistant",
      },
      {
        id: "3",
        sender: "Claude Assistant",
        content: "Absolutely. Dependency arrays are crucial for performance. Let me walk through some examples.",
        timestamp: "10:34 AM",
        role: "assistant",
      },
    ])
  }, [])

  const getEthicsColor = (status: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background cosmic-gradient">
        <p className="text-text-secondary">Loading interaction...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background cosmic-gradient">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(124,93,255,0.05)_1px,transparent_1px),linear-gradient(rgba(124,93,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <AppHeader>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">{conversation?.title}</h2>
          <Badge className={`${getEthicsColor(conversation?.ethicsReview || "pending")}`}>
            {conversation?.ethicsReview}
          </Badge>
        </div>
      </AppHeader>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/demo"
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-text-secondary hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground">{conversation?.title}</h1>
          </div>
        </div>

        {/* Participants */}
        {conversation?.agents && (
          <div className="mb-8 glass-sm border border-border/30 rounded-xl p-4">
            <p className="text-sm text-text-secondary mb-3 font-medium">Participants</p>
            <div className="flex flex-wrap gap-2">
              {conversation.agents.map((agent) => (
                <Badge key={agent} className="bg-primary/20 text-primary border border-primary/30 rounded-full">
                  {agent}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4 mb-8">
          {messages.map((message) => (
            <div key={message.id} className="glass-sm border border-border/30 rounded-xl p-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{message.sender}</p>
                <span className="text-xs text-text-muted">{message.timestamp}</span>
              </div>
              <p className="text-text-secondary leading-relaxed">{message.content}</p>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="glass-sm border border-border/30 rounded-xl p-6 text-center text-text-secondary">
          <p className="text-sm">
            This interaction contains {conversation?.messageCount} messages and was created on {conversation?.createdAt}
          </p>
        </div>
      </div>
    </div>
  )
}
