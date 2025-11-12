"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface EthicsCrudModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  metric?: any
  onSave: () => void
}

export function EthicsCrudModal({ open, onOpenChange, metric, onSave }: EthicsCrudModalProps) {
  const [name, setName] = useState(metric?.key?.replace(/^ethics_/, "") || "")
  const [threshold, setThreshold] = useState(metric?.threshold || 70)
  const [weight, setWeight] = useState(metric?.weight || 1.0)
  const [description, setDescription] = useState(metric?.description || "")
  const [icon, setIcon] = useState(metric?.icon || "📊")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = metric
        ? {
            id: metric.id,
            value: {
              score: metric.score,
              threshold,
              weight,
              icon,
              color: metric.color,
            },
            description,
          }
        : {
            key: name.toLowerCase().replace(/\s+/g, "_"),
            value: {
              score: 0,
              threshold,
              weight,
              icon,
              color: "from-gray-500 to-gray-600",
            },
            description,
            type: "object",
          }

      const url = "/api/governance/ethics"
      const method = metric ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save ethics metric")

      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving ethics metric:", error)
      alert("Failed to save ethics metric")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{metric ? "Edit Ethics Metric" : "Create Ethics Metric"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Metric Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Truthfulness"
              disabled={!!metric}
              required
            />
            {metric && (
              <p className="text-xs text-text-muted">
                This is{" "}
                {metric.name === "Human Primacy" ||
                metric.name === "Reproducibility" ||
                metric.name === "Verifiability" ||
                metric.name === "Harmony" ||
                metric.name === "Equilibrium"
                  ? "one of the Five Laws. You can customize thresholds and weights."
                  : "a custom ethics metric."}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="📊" maxLength={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this metric measures..."
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="threshold">Compliance Threshold</Label>
              <span className="text-sm font-bold text-foreground">{threshold}%</span>
            </div>
            <Slider
              id="threshold"
              value={[threshold]}
              onValueChange={(v) => setThreshold(v[0])}
              min={0}
              max={100}
              step={1}
            />
            <p className="text-xs text-text-muted">Minimum score required for compliance</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="weight">Weight</Label>
              <span className="text-sm font-bold text-foreground">{weight.toFixed(1)}</span>
            </div>
            <Slider
              id="weight"
              value={[weight * 10]}
              onValueChange={(v) => setWeight(v[0] / 10)}
              min={1}
              max={30}
              step={1}
            />
            <p className="text-xs text-text-muted">Importance multiplier in overall ethics score</p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : metric ? "Update Metric" : "Create Metric"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
