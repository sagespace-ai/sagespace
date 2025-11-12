"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Star, Archive, MessageSquare } from "@/components/icons"

interface Conversation {
  id: string
  title: string
  agent_role: string
  agent_avatar: string
  description: string
  message_count: number
  last_message_at: string
  is_pinned: boolean
  archived: boolean
  created_at: string
}

export default function MultiversePage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [showArchived])

  useEffect(() => {
    filterConversations()
  }, [searchQuery, selectedRole, conversations])

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations/multiverse?includeArchived=${showArchived}`)
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterConversations = () => {
    let filtered = [...conversations]

    if (searchQuery) {
      filtered = filtered.filter(
        (conv) =>
          conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.agent_role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedRole) {
      filtered = filtered.filter((conv) => conv.agent_role === selectedRole)
    }

    filtered.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
      return (
        new Date(b.last_message_at || b.created_at).getTime() - new Date(a.last_message_at || a.created_at).getTime()
      )
    })

    setFilteredConversations(filtered)
  }

  const roles = Array.from(new Set(conversations.map((c) => c.agent_role))).filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Multiverse Chats
            </h1>
            <p className="text-slate-400 mt-2">Your persistent conversations across the agent universe</p>
          </div>
          <Link href="/playground">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showArchived ? "default" : "outline"}
              onClick={() => setShowArchived(!showArchived)}
              className="whitespace-nowrap"
            >
              <Archive className="w-4 h-4 mr-2" />
              {showArchived ? "Hide Archived" : "Show Archived"}
            </Button>
          </div>
        </div>

        {roles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedRole === null ? "default" : "outline"}
              onClick={() => setSelectedRole(null)}
              size="sm"
            >
              All Roles
            </Button>
            {roles.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                onClick={() => setSelectedRole(role)}
                size="sm"
              >
                {role}
              </Button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading conversations...</div>
        ) : filteredConversations.length === 0 ? (
          <Card className="p-12 text-center bg-slate-900/50 border-slate-700">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No conversations yet</h3>
            <p className="text-slate-400 mb-6">Start a new chat with an agent to begin</p>
            <Link href="/playground">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
                <Plus className="w-4 h-4 mr-2" />
                Start Chatting
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConversations.map((conversation) => (
              <Link key={conversation.id} href={`/multiverse/${conversation.id}`}>
                <Card className="p-4 bg-slate-900/50 border-slate-700 hover:border-purple-500 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{conversation.agent_avatar || "🤖"}</div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                          {conversation.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {conversation.agent_role}
                        </Badge>
                      </div>
                    </div>
                    {conversation.is_pinned && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                  </div>

                  {conversation.description && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{conversation.description}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{conversation.message_count} messages</span>
                    <span>
                      {conversation.last_message_at
                        ? new Date(conversation.last_message_at).toLocaleDateString()
                        : new Date(conversation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
