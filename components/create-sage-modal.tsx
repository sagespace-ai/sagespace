"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon } from "@/components/icons"

interface CreateSageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateSageModal({ open, onOpenChange, onSuccess }: CreateSageModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    purpose: "",
    description: "",
    status: "idle" as "active" | "idle" | "thinking",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      console.log("[v0] Creating sage with data:", formData)

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          purpose: formData.purpose,
          description: formData.description,
          status: formData.status,
          harmonyScore: 75,
          ethicsAlignment: 85,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create sage")
      }

      const newAgent = await response.json()
      console.log("[v0] Sage created successfully:", newAgent)

      setFormData({
        name: "",
        role: "",
        purpose: "",
        description: "",
        status: "idle",
      })
      onOpenChange(false)
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSuccess()
    } catch (err) {
      console.error("[v0] Error creating sage:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border border-border/50 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create New Sage
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Spawn a new intelligent agent to inhabit your universe.
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
              Initial Status
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
                  Creating...
                </>
              ) : (
                "Create Sage"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
