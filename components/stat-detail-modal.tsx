"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, Users, MessageSquare, Clock } from "@/components/icons"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  role: string
  status: "active" | "idle" | "thinking"
  harmonyScore: number
  ethicsAlignment: number
}

interface Conversation {
  id: string
  title: string
  messageCount: number
  ethicsReview: "passed" | "pending" | "flagged"
}

interface StatDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "total" | "active" | "interactions" | "messages" | "harmony" | "ethics"
  agents: Agent[]
  conversations: Conversation[]
}

export function StatDetailModal({ open, onOpenChange, type, agents, conversations }: StatDetailModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success border-success/30"
      case "idle":
        return "bg-muted/20 text-muted-foreground border-muted/30"
      case "thinking":
        return "bg-accent/20 text-accent border-accent/30"
      default:
        return "bg-border/20 text-muted-foreground"
    }
  }

  const renderContent = () => {
    switch (type) {
      case "total":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                All Sages ({agents.length})
              </DialogTitle>
              <DialogDescription>Complete roster of intelligent entities in your universe</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-3 mt-4">
                {agents.map((agent) => (
                  <Link key={agent.id} href={`/chat/${agent.id}`} onClick={() => onOpenChange(false)}>
                    <div className="p-4 glass-sm border border-border/30 rounded-lg hover:border-primary/50 transition-subtle cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{agent.name}</h4>
                          <p className="text-sm text-accent">{agent.role}</p>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(agent.status)} text-xs`}>
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                        <div>Harmony: {agent.harmonyScore}%</div>
                        <div>Ethics: {agent.ethicsAlignment}%</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </>
        )

      case "active":
        const activeAgents = agents.filter((a) => a.status === "active")
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-success" />
                Active Sages ({activeAgents.length})
              </DialogTitle>
              <DialogDescription>Currently active and processing entities</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-3 mt-4">
                {activeAgents.length > 0 ? (
                  activeAgents.map((agent) => (
                    <Link key={agent.id} href={`/chat/${agent.id}`} onClick={() => onOpenChange(false)}>
                      <div className="p-4 glass-sm border border-success/30 rounded-lg hover:border-success/60 transition-subtle cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-success animate-pulse" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{agent.name}</h4>
                            <p className="text-sm text-accent">{agent.role}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                          <div>Harmony: {agent.harmonyScore}%</div>
                          <div>Ethics: {agent.ethicsAlignment}%</div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No active sages at the moment</p>
                )}
              </div>
            </ScrollArea>
          </>
        )

      case "interactions":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-accent" />
                All Interactions ({conversations.length})
              </DialogTitle>
              <DialogDescription>Conversations between your sages</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-3 mt-4">
                {conversations.map((conv) => (
                  <Link key={conv.id} href={`/interactions/${conv.id}`} onClick={() => onOpenChange(false)}>
                    <div className="p-4 glass-sm border border-border/30 rounded-lg hover:border-accent/50 transition-subtle cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{conv.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            conv.ethicsReview === "passed"
                              ? "bg-success/20 text-success border-success/30"
                              : conv.ethicsReview === "flagged"
                                ? "bg-error/20 text-error border-error/30"
                                : "bg-warning/20 text-warning border-warning/30"
                          }`}
                        >
                          {conv.ethicsReview}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{conv.messageCount} messages exchanged</p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </>
        )

      case "messages":
        const totalMessages = conversations.reduce((sum, c) => sum + (c.messageCount || 0), 0)
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                Total Messages ({totalMessages})
              </DialogTitle>
              <DialogDescription>Message distribution across conversations</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-3 mt-4">
                {conversations
                  .sort((a, b) => b.messageCount - a.messageCount)
                  .map((conv) => (
                    <Link key={conv.id} href={`/interactions/${conv.id}`} onClick={() => onOpenChange(false)}>
                      <div className="p-4 glass-sm border border-border/30 rounded-lg hover:border-primary/50 transition-subtle cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground flex-1 truncate">{conv.title}</h4>
                          <span className="text-lg font-bold text-primary ml-2">{conv.messageCount}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${(conv.messageCount / totalMessages) * 100}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </ScrollArea>
          </>
        )

      case "harmony":
        const avgHarmony = agents.length > 0 ? agents.reduce((sum, a) => sum + a.harmonyScore, 0) / agents.length : 0
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-2xl">🎵</span>
                Average Harmony ({Math.round(avgHarmony)}%)
              </DialogTitle>
              <DialogDescription>How well your sages work together cohesively</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-3 mt-4">
                {agents
                  .sort((a, b) => b.harmonyScore - a.harmonyScore)
                  .map((agent) => (
                    <Link key={agent.id} href={`/chat/${agent.id}`} onClick={() => onOpenChange(false)}>
                      <div className="p-4 glass-sm border border-border/30 rounded-lg hover:border-primary/50 transition-subtle cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{agent.name}</h4>
                            <p className="text-xs text-accent">{agent.role}</p>
                          </div>
                          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {agent.harmonyScore}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                            style={{ width: `${agent.harmonyScore}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </ScrollArea>
          </>
        )

      case "ethics":
        const avgEthics = agents.length > 0 ? agents.reduce((sum, a) => sum + a.ethicsAlignment, 0) / agents.length : 0
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                Average Ethics ({Math.round(avgEthics)}%)
              </DialogTitle>
              <DialogDescription>Ethical alignment across all sages</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-3 mt-4">
                {agents
                  .sort((a, b) => b.ethicsAlignment - a.ethicsAlignment)
                  .map((agent) => (
                    <Link key={agent.id} href={`/chat/${agent.id}`} onClick={() => onOpenChange(false)}>
                      <div className="p-4 glass-sm border border-border/30 rounded-lg hover:border-success/50 transition-subtle cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{agent.name}</h4>
                            <p className="text-xs text-accent">{agent.role}</p>
                          </div>
                          <span className="text-lg font-bold text-success">{agent.ethicsAlignment}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success transition-all"
                            style={{ width: `${agent.ethicsAlignment}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </ScrollArea>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass border-border/30">{renderContent()}</DialogContent>
    </Dialog>
  )
}
