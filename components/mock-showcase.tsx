"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Agent, Conversation, TimelineEvent, Setting } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export function MockShowcase() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMocks = async () => {
      try {
        const [agentsRes, convsRes, timelineRes, settingsRes] = await Promise.all([
          fetch("/api/agents"),
          fetch("/api/conversations"),
          fetch("/api/timeline"),
          fetch("/api/settings"),
        ])

        setAgents(await agentsRes.json())
        setConversations(await convsRes.json())
        setTimeline(await timelineRes.json())
        setSettings(await settingsRes.json())
      } catch (error) {
        console.error("Failed to fetch mocks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMocks()
  }, [])

  if (loading) {
    return <MockShowcaseSkeleton />
  }

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">Agents ({agents.length})</TabsTrigger>
          <TabsTrigger value="conversations">Conversations ({conversations.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline ({timeline.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings ({settings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{agent.avatar}</span>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={agent.status === "active" ? "default" : "secondary"}>{agent.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Role:</span>
                      <p className="font-medium">{agent.role}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{new Date(agent.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <div className="grid gap-4">
            {conversations.map((conv) => (
              <Card key={conv.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{conv.title}</CardTitle>
                      <CardDescription>{conv.description}</CardDescription>
                    </div>
                    {conv.archived && <Badge variant="outline">Archived</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Messages:</span>
                      <p className="font-medium">{conv.messages.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Participants:</span>
                      <p className="font-medium">{conv.participants.length}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {conv.participants.map((p) => (
                      <Badge key={p.id} variant="secondary">
                        {p.name}
                      </Badge>
                    ))}
                  </div>
                  {conv.messages.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs text-muted-foreground mb-2">Recent messages:</p>
                      <div className="space-y-2">
                        {conv.messages.slice(-2).map((msg) => (
                          <div key={msg.id} className="text-sm p-2 bg-muted rounded">
                            <p className="font-medium text-xs text-muted-foreground">
                              {msg.role === "user" ? "You" : "Agent"}
                            </p>
                            <p className="line-clamp-2">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-2">
            {timeline.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  {index < timeline.length - 1 && <div className="w-px h-12 bg-border"></div>}
                </div>
                <Card className="flex-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm">{event.title}</CardTitle>
                        {event.description && (
                          <CardDescription className="text-xs">{event.description}</CardDescription>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4">
            {settings.map((setting) => (
              <Card key={setting.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{setting.key}</CardTitle>
                      <CardDescription>{setting.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{setting.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {setting.type === "boolean"
                        ? setting.value
                          ? "✓ Enabled"
                          : "✗ Disabled"
                        : JSON.stringify(setting.value)}
                    </span>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MockShowcaseSkeleton() {
  return (
    <div className="w-full space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
