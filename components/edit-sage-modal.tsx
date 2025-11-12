"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon } from "@/components/icons"

interface Agent {
  id: string
  name: string
  role: string
  status: "active" | "idle" | "thinking"
  purpose: string
  description?: string
  harmonyScore: number
  ethicsAlignment: number
}

interface EditSageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent: Agent | null
  onSuccess: () => void
}

export function EditSageModal({ open, onOpenChange, agent, onSuccess }: EditSageModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    purpose: "",
    description: "",
    status: "idle" as "active" | "idle" | "thinking",
    harmonyScore: 75,
    ethicsAlignment: 85,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        role: agent.role,
        purpose: agent.purpose,
        description: agent.description || "",
        status: agent.status,
        harmonyScore: agent.harmonyScore,
        ethicsAlignment: agent.ethicsAlignment,
      })
    }
  }, [agent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agent) return

    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update sage")
      }

      onOpenChange(false)
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSuccess()
    } catch (err) {
      console.error("[v0] Error updating sage:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border border-border/50 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Edit Sage
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Update the configuration and attributes of this sage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Claude Assistant"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="glass border-border/30 focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground font-medium">
              Role *
            </Label>
            <Input
              id="role"
              placeholder="e.g., General Assistant, Research Analyst"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              className="glass border-border/30 focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-foreground font-medium">
              Purpose *
            </Label>
            <Input
              id="purpose"
              placeholder="e.g., Assists with daily tasks and conversations"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
              className="glass border-border/30 focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed description of this sage's capabilities and characteristics..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="glass border-border/30 focus:border-primary/50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground font-medium">
              Status
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg glass border border-border/30 focus:border-primary/50 text-foreground bg-background"
            >
              <option value="idle">Idle</option>
              <option value="active">Active</option>
              <option value="thinking">Thinking</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harmony" className="text-foreground font-medium">
                Harmony Score: {formData.harmonyScore}%
              </Label>
              <input
                type="range"
                id="harmony"
                min="0"
                max="100"
                value={formData.harmonyScore}
                onChange={(e) => setFormData({ ...formData, harmonyScore: Number.parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethics" className="text-foreground font-medium">
                Ethics Alignment: {formData.ethicsAlignment}%
              </Label>
              <input
                type="range"
                id="ethics"
                min="0"
                max="100"
                value={formData.ethicsAlignment}
                onChange={(e) => setFormData({ ...formData, ethicsAlignment: Number.parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {error && <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm">{error}</div>}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 glass border-border/30"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
