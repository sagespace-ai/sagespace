"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircleIcon } from "@/components/icons"

interface TaskCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TaskCreationModal({ open, onOpenChange, onSuccess }: TaskCreationModalProps) {
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!description.trim()) {
      setError("Please provide a task description")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/orchestration/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: description,
          purpose: { goal: description, context: "User-initiated orchestration task" },
          priority,
          requiresHumanApproval: priority === "high",
        }),
      })

      if (res.ok) {
        setDescription("")
        setPriority("medium")
        onSuccess()
        onOpenChange(false)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to create task")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border border-border/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Create Orchestrated Task</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Submit a task for multi-agent orchestration with Five Laws oversight
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want the agents to accomplish..."
              className="glass border-border/30 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg glass border border-border/30 text-foreground bg-background"
            >
              <option value="low">Low - Autonomous execution</option>
              <option value="medium">Medium - Standard oversight</option>
              <option value="high">High - Requires human approval</option>
            </select>
          </div>

          {priority === "high" && (
            <div className="flex items-start gap-2 text-sm text-warning bg-warning/10 border border-warning/30 rounded-lg p-3">
              <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>High priority tasks will require human approval before execution</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg p-3">
              <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
            >
              {submitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
