"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Agent {
  id: string
  name: string
  role: string
  avatar: string
  status: string
  harmony_score: number
}

export function SpatialMap({ agents }: { agents: Agent[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null)
  const [agentPositions, setAgentPositions] = useState<Map<string, { x: number; y: number; angle: number }>>(new Map())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const orbitRadius = 150

    const positions = new Map()
    agents.forEach((agent, index) => {
      const angle = (index / agents.length) * Math.PI * 2
      positions.set(agent.id, {
        x: centerX + Math.cos(angle) * orbitRadius,
        y: centerY + Math.sin(angle) * orbitRadius,
        angle: angle,
      })
    })
    setAgentPositions(positions)

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "rgba(139, 92, 246, 0.1)"
      ctx.beginPath()
      ctx.arc(centerX, centerY, orbitRadius + 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = "rgba(139, 92, 246, 0.3)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2)
      ctx.stroke()

      positions.forEach((pos, agentId) => {
        const agent = agents.find((a) => a.id === agentId)
        if (!agent) return

        pos.angle += 0.002

        pos.x = centerX + Math.cos(pos.angle) * orbitRadius
        pos.y = centerY + Math.sin(pos.angle) * orbitRadius

        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 20)
        gradient.addColorStop(0, agent.status === "active" ? "rgba(6, 182, 212, 0.8)" : "rgba(139, 92, 246, 0.6)")
        gradient.addColorStop(1, "rgba(139, 92, 246, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "white"
        ctx.font = "20px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(agent.avatar, pos.x, pos.y)
      })

      ctx.fillStyle = "rgba(139, 92, 246, 0.5)"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "white"
      ctx.font = "24px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("🌌", centerX, centerY)

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [agents])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let foundAgent: Agent | null = null

    agentPositions.forEach((pos, agentId) => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
      if (distance < 20) {
        foundAgent = agents.find((a) => a.id === agentId) || null
      }
    })

    setHoveredAgent(foundAgent)
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onMouseMove={handleMouseMove}
        className="rounded-lg bg-slate-950/50 cursor-pointer"
      />
      {hoveredAgent && (
        <Card className="absolute top-4 right-4 p-4 bg-slate-900/90 border-purple-500 backdrop-blur">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">{hoveredAgent.avatar}</div>
            <div>
              <h3 className="font-semibold text-white">{hoveredAgent.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {hoveredAgent.role}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Status:</span>
            <Badge variant={hoveredAgent.status === "active" ? "default" : "secondary"}>{hoveredAgent.status}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className="text-slate-400">Harmony:</span>
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${hoveredAgent.harmony_score}%` }}
              />
            </div>
            <span className="text-white font-semibold">{hoveredAgent.harmony_score}</span>
          </div>
        </Card>
      )}
    </div>
  )
}
