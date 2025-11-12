"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, XCircle, AlertTriangle, Users, Sparkles, Loader2 } from "lucide-react"
import { AgentAssignment } from "@/components/agent-assignment"

interface Task {
  id: string
  intent: string
  status: "pending" | "planning" | "executing" | "reviewing" | "approved" | "rejected" | "completed"
  priority: "low" | "medium" | "high" | "critical"
  purpose: any
  requires_pre_approval: boolean
  created_at: string
  plan?: any
  auditEvents?: any[]
}

interface TaskDetailModalProps {
  task: Task | null
  onClose: () => void
  onRefresh: () => void
}

export function TaskDetailModal({ task, onClose, onRefresh }: TaskDetailModalProps) {
  const [taskDetails, setTaskDetails] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAssignment, setShowAssignment] = useState(false)

  useEffect(() => {
    if (task) {
      fetchTaskDetails()
    }
  }, [task])

  const fetchTaskDetails = async () => {
    if (!task) return

    setLoading(true)
    try {
      const res = await fetch(`/api/orchestration/tasks/${task.id}`)
      if (res.ok) {
        const data = await res.json()
        setTaskDetails(data)
      } else {
        console.error("[v0] Failed to fetch task details")
        setTaskDetails(task)
      }
    } catch (error) {
      console.error("[v0] Error fetching task details:", error)
      setTaskDetails(task)
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  const statusIcons = {
    pending: Clock,
    planning: Sparkles,
    executing: AlertTriangle,
    reviewing: Users,
    approved: CheckCircle2,
    rejected: XCircle,
    completed: CheckCircle2,
  }

  const StatusIcon = statusIcons[task.status] || Clock

  const assignedAgents = (taskDetails?.purpose?.assignedAgents || []) as string[]

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="glass border border-border/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <StatusIcon className="w-6 h-6" />
            Task Orchestration
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-sm border border-primary/20 rounded-lg p-6">
              <h3 className="text-sm font-medium text-text-muted mb-2">Task Description</h3>
              <p className="text-lg text-foreground leading-relaxed">{taskDetails?.intent || task.intent}</p>
            </div>

            {taskDetails?.purpose && typeof taskDetails.purpose === "object" && (
              <div className="glass-sm border border-border/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-muted mb-2">Additional Context</h4>
                <pre className="text-xs text-text-secondary overflow-x-auto">
                  {JSON.stringify(taskDetails.purpose, null, 2)}
                </pre>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-text-muted mb-1">Status</p>
                <Badge
                  className={`
                ${task.status === "completed" ? "bg-success/20 text-success border-success/30" : ""}
                ${task.status === "executing" ? "bg-primary/20 text-primary border-primary/30" : ""}
                ${task.status === "pending" ? "bg-warning/20 text-warning border-warning/30" : ""}
                ${task.status === "rejected" ? "bg-error/20 text-error border-error/30" : ""}
              `}
                >
                  {task.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-text-muted mb-1">Priority</p>
                <Badge variant="outline" className="capitalize">
                  {task.priority}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-text-muted mb-1">Pre-Approval</p>
                <Badge variant="outline">{task.requires_pre_approval ? "Required" : "Not Required"}</Badge>
              </div>

              <div>
                <p className="text-sm text-text-muted mb-1">Assigned Agents</p>
                <Badge variant="outline">{assignedAgents.length} agent(s)</Badge>
              </div>
            </div>

            {!showAssignment && assignedAgents.length === 0 && task.status === "pending" && (
              <div className="glass-sm border border-primary/30 rounded-lg p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h4 className="text-lg font-semibold mb-2">No Agents Assigned</h4>
                <p className="text-text-secondary mb-4">
                  Assign agents to execute this task or get AI-powered suggestions
                </p>
                <Button onClick={() => setShowAssignment(true)} className="gap-2">
                  <Users className="w-4 h-4" />
                  Assign Agents
                </Button>
              </div>
            )}

            {showAssignment && (
              <AgentAssignment
                taskId={task.id}
                onAssigned={() => {
                  setShowAssignment(false)
                  fetchTaskDetails()
                  onRefresh()
                }}
                onCancel={() => setShowAssignment(false)}
              />
            )}

            {assignedAgents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigned Agents ({assignedAgents.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assignedAgents.map((agentId: string) => (
                    <div key={agentId} className="glass-sm border border-border/30 rounded-lg p-4">
                      <p className="text-sm text-text-secondary">Agent ID: {agentId.substring(0, 8)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {taskDetails?.plan && taskDetails.plan.steps && Array.isArray(taskDetails.plan.steps) && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Execution Plan
                </h3>
                <div className="space-y-2">
                  {taskDetails.plan.steps.map((step: any, idx: number) => (
                    <div
                      key={step.id || idx}
                      className="flex items-center gap-3 p-3 glass-sm border border-border/30 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{step.action}</p>
                        <p className="text-xs text-text-muted">Agent: {step.agentRole || "unassigned"}</p>
                      </div>
                      <Badge className="text-xs" variant="outline">
                        {step.status || "pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
                {taskDetails.plan.risk_score !== undefined && (
                  <div className="mt-3 text-sm text-text-muted">
                    <p>
                      <strong>Risk Score:</strong> {(taskDetails.plan.risk_score * 100).toFixed(0)}%
                    </p>
                    {taskDetails.plan.rationale && (
                      <p>
                        <strong>Rationale:</strong> {taskDetails.plan.rationale}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {taskDetails?.auditEvents && taskDetails.auditEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Activity Log</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {taskDetails.auditEvents.map((event: any) => (
                    <div key={event.id} className="text-sm glass-sm border border-border/20 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{event.action}</span>
                        <span className="text-xs text-text-muted">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-text-muted">Actor: {event.actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-text-muted pt-4 border-t border-border/20">
              Created: {new Date(task.created_at).toLocaleString()}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
