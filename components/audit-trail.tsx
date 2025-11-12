"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Scale, AlertTriangle } from "lucide-react"

interface AuditEvent {
  id: string
  eventType: string
  description: string
  severity: "info" | "warning" | "critical"
  actor: string
  metadata: Record<string, any>
  timestamp: string
}

interface AuditTrailProps {
  events: AuditEvent[]
}

export function AuditTrail({ events }: AuditTrailProps) {
  const getEventIcon = (type: string) => {
    if (type.includes("approval")) return Scale
    if (type.includes("safety")) return Shield
    if (type.includes("violation")) return AlertTriangle
    return FileText
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-error"
      case "warning":
        return "text-warning"
      default:
        return "text-primary"
    }
  }

  if (events.length === 0) {
    return (
      <Card className="glass-sm border border-border/30 p-12 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-primary/50" />
        <h3 className="text-xl font-bold text-foreground mb-2">No Audit Events</h3>
        <p className="text-text-secondary">Audit trail will appear here as actions are taken</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">Immutable Audit Trail</h3>
        <Badge variant="outline">{events.length} events</Badge>
      </div>

      <div className="space-y-3">
        {events.map((event, idx) => {
          const EventIcon = getEventIcon(event.eventType)

          return (
            <Card
              key={event.id}
              className="glass-sm border border-border/30 p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex gap-4">
                {idx < events.length - 1 && (
                  <div className="absolute left-[27px] top-16 w-0.5 h-12 bg-gradient-to-b from-primary/30 to-transparent" />
                )}

                <div
                  className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ${getSeverityColor(event.severity)}`}
                >
                  <EventIcon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{event.description}</h4>
                      <p className="text-xs text-text-muted mt-1">
                        {event.actor} • {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="text-xs capitalize" variant="outline">
                        {event.eventType}
                      </Badge>
                      <Badge
                        className={`text-xs capitalize ${
                          event.severity === "critical"
                            ? "bg-error/20 text-error"
                            : event.severity === "warning"
                              ? "bg-warning/20 text-warning"
                              : "bg-primary/20 text-primary"
                        }`}
                      >
                        {event.severity}
                      </Badge>
                    </div>
                  </div>

                  {Object.keys(event.metadata).length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-text-muted hover:text-primary">View metadata</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
