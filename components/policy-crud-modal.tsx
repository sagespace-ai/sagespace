"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { XIcon } from "@/components/icons"

interface PolicyCrudModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policy?: any
  onSave: () => void
}

export function PolicyCrudModal({ open, onOpenChange, policy, onSave }: PolicyCrudModalProps) {
  const [name, setName] = useState(policy?.name || "")
  const [version, setVersion] = useState(policy?.version || "1.0.0")
  const [scope, setScope] = useState<string[]>(policy?.rules?.scope || [])
  const [newScope, setNewScope] = useState("")
  const [description, setDescription] = useState(policy?.rules?.description || "")
  const [constraints, setConstraints] = useState(policy?.rules?.constraints || "")
  const [loading, setLoading] = useState(false)

  const handleAddScope = () => {
    if (newScope.trim() && !scope.includes(newScope.trim())) {
      setScope([...scope, newScope.trim()])
      setNewScope("")
    }
  }

  const handleRemoveScope = (item: string) => {
    setScope(scope.filter((s) => s !== item))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name,
        version,
        rules: {
          scope,
          description,
          constraints: constraints.split("\n").filter((c) => c.trim()),
        },
        effective_from: new Date().toISOString(),
      }

      const url = policy ? `/api/governance/policies/${policy.id}` : "/api/governance/policies"
      const method = policy ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        if (res.status === 404) {
          alert(
            "Policy management requires the governance tables to be set up. Please run the SQL script from scripts/005-add-policies-table.sql in your Supabase dashboard.",
          )
          return
        }
        throw new Error(errorData.error || "Failed to save policy")
      }

      onSave()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error saving policy:", error)
      alert(error.message || "Failed to save policy")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{policy ? "Edit Policy" : "Create New Policy"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Policy Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Human Primacy Protection"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope">Scope (Domains)</Label>
            <div className="flex gap-2">
              <Input
                id="scope"
                value={newScope}
                onChange={(e) => setNewScope(e.target.value)}
                placeholder="e.g., agents, conversations, data"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddScope()
                  }
                }}
              />
              <Button type="button" onClick={handleAddScope} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {scope.map((item) => (
                <Badge key={item} variant="outline" className="gap-1">
                  {item}
                  <button type="button" onClick={() => handleRemoveScope(item)} className="hover:text-error">
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this policy enforces..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints">Constraints (one per line)</Label>
            <Textarea
              id="constraints"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g., Require human approval for sensitive actions&#10;Maintain audit trail for all decisions&#10;Enforce data retention limits"
              rows={5}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : policy ? "Update Policy" : "Create Policy"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
