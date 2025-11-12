"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

interface Approval {
  id: string
  taskId: string
  description: string
  riskAssessment: string
  requestedBy: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface ApprovalQueueProps {
  approvals: Approval[]
  onRefresh: () => void
}

export function ApprovalQueue({ approvals, onRefresh }: ApprovalQueueProps) {
  const handleApproval = async (approvalId: string, approved: boolean) => {
    try {
      await fetch(`/api/orchestration/approvals/${approvalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      })
      onRefresh()
    } catch (error) {
      console.error("[v0] Error updating approval:", error)
    }
  }

  const pending = approvals.filter((a) => a.status === "pending")
  const processed = approvals.filter((a) => a.status !== "pending")

  return (
    <div className="space-y-6">
      {pending.length > 0 ? (
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Pending Approvals ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((approval) => (
              <Card key={approval.id} className="glass-sm border border-warning/30 p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-foreground mb-2">{approval.description}</h4>
                    <p className="text-sm text-text-secondary mb-3">{approval.riskAssessment}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>Requested by: {approval.requestedBy}</span>
                      <span>•</span>
                      <span>{new Date(approval.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleApproval(approval.id, true)}
                      className="flex-1 bg-success hover:bg-success/90 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleApproval(approval.id, false)}
                      variant="outline"
                      className="flex-1 border-error/30 text-error hover:bg-error/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="glass-sm border border-border/30 p-12 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-success/50" />
          <h3 className="text-xl font-bold text-foreground mb-2">All Clear</h3>
          <p className="text-text-secondary">No pending approvals at this time</p>
        </Card>
      )}

      {processed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Decisions</h3>
          <div className="space-y-2">
            {processed.slice(0, 5).map((approval) => (
              <Card key={approval.id} className="glass-sm border border-border/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{approval.description}</p>
                    <p className="text-xs text-text-muted mt-1">{new Date(approval.createdAt).toLocaleString()}</p>
                  </div>
                  <Badge
                    className={approval.status === "approved" ? "bg-success/20 text-success" : "bg-error/20 text-error"}
                  >
                    {approval.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
