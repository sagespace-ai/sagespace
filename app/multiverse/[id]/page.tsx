"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Star, Archive, Share2 } from "@/components/icons"
import Link from "next/link"
import { useChat } from "ai"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  agent_role: string
  agent_avatar: string
  description: string
  message_count: number
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [expandedReasonings, setExpandedReasonings] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: {
      agentRole: conversation?.agent_role,
      agentName: conversation?.agent_role,
    },
    onFinish: async (message) => {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "assistant",
          content: message.content,
        }),
      })
    },
  })

  useEffect(() => {
    fetchConversation()
    fetchMessages()
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      const data = await response.json()
      setConversation(data.conversation)
    } catch (error) {
      console.error("Error fetching conversation:", error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      const data = await response.json()
      setMessages(
        data.messages.map((msg: Message) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        })),
      )
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: "user",
        content: input,
      }),
    })

    handleSubmit(e)
  }

  const toggleReasoning = (messageId: string) => {
    const newExpanded = new Set(expandedReasonings)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedReasonings(newExpanded)
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading conversation...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <Link href="/multiverse">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{conversation.agent_avatar || "🤖"}</div>
              <div>
                <h1 className="text-xl font-bold text-white">{conversation.title}</h1>
                <Badge variant="secondary" className="text-xs">
                  {conversation.agent_role}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 mb-4 max-h-[calc(100vh-250px)] overflow-y-auto">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-cyan-700/50 ml-12"
                  : "bg-slate-900/50 border-slate-700 mr-12"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{message.role === "user" ? "👤" : conversation.agent_avatar || "🤖"}</div>
                <div className="flex-1">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {isLoading && (
            <Card className="p-4 bg-slate-900/50 border-slate-700 mr-12">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{conversation.agent_avatar || "🤖"}</div>
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={`Chat with ${conversation.agent_role}...`}
            className="flex-1 bg-slate-900/50 border-slate-700"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-cyan-500 to-purple-500"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
