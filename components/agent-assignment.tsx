"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sparkles, Loader2, CheckCircle2, Users } from "lucide-react"

interface AgentSuggestion {
  agentId: string
  agentName: string
  role: string
  reasoning: string
  confidenceScore: number
}

interface AgentAssignmentProps {
  taskId: string
  onAssigned: () => void
  onCancel: () => void
}

export function AgentAssignment({ taskId, onAssigned, onCancel }: AgentAssignmentProps) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AgentSuggestion[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    getSuggestions()
  }, [])

  const getSuggestions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orchestration/tasks/${taskId}/suggest-agents`, {
        method: "POST",
      })
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data.recommendations || [])
      }
    } catch (error) {
      console.error("[v0] Error getting suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) => (prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]))
  }

  const handleAssign = async () => {
    if (selectedAgents.length === 0) return

    setAssigning(true)
    try {
      const res = await fetch(`/api/orchestration/tasks/${taskId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentIds: selectedAgents }),
      })

      if (res.ok) {
        onAssigned()
      }
    } catch (error) {
      console.error("[v0] Error assigning agents:", error)
    } finally {
      setAssigning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI-Suggested Agents
        </h3>
        <Button variant="outline" size="sm" onClick={getSuggestions} disabled={loading}>
          Refresh Suggestions
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card
              key={suggestion.agentId}
              className={`p-4 cursor-pointer transition-all ${
                selectedAgents.includes(suggestion.agentId)
                  ? "border-primary bg-primary/10"
                  : "border-border/30 hover:border-primary/50"
              }`}
              onClick={() => toggleAgent(suggestion.agentId)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedAgents.includes(suggestion.agentId) ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  {selectedAgents.includes(suggestion.agentId) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Users className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{suggestion.agentName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.role}
                    </Badge>
                    <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                      {(suggestion.confidenceScore * 100).toFixed(0)}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary">{suggestion.reasoning}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center border-border/30">
          <p className="text-text-secondary">No agent suggestions available</p>
        </Card>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border/20">
        <p className="text-sm text-text-secondary">{selectedAgents.length} agent(s) selected</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={assigning}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={selectedAgents.length === 0 || assigning} className="gap-2">
            {assigning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Assign {selectedAgents.length} Agent(s)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
