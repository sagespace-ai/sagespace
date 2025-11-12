"use client"

import { useEffect, useRef } from "react"

type Agent = {
  id: string
  name: string
  role: string
  x?: number
  y?: number
}

type Interaction = {
  agent_a_id: string
  agent_b_id: string
  interaction_type: string
  confidence: number
}

type AgentNetworkGraphProps = {
  agents: Agent[]
  interactions: Interaction[]
}

export function AgentNetworkGraph({ agents, interactions }: AgentNetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Position agents in a circle
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35

    const agentsWithPositions = agents.map((agent, idx) => {
      const angle = (idx / agents.length) * 2 * Math.PI - Math.PI / 2
      return {
        ...agent,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    // Draw connections
    interactions.forEach((interaction) => {
      const agentA = agentsWithPositions.find((a) => a.id === interaction.agent_a_id)
      const agentB = agentsWithPositions.find((a) => a.id === interaction.agent_b_id)

      if (agentA && agentB && agentA.x && agentA.y && agentB.x && agentB.y) {
        ctx.beginPath()
        ctx.moveTo(agentA.x, agentA.y)
        ctx.lineTo(agentB.x, agentB.y)
        ctx.strokeStyle = `rgba(139, 92, 246, ${interaction.confidence})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    // Draw agents
    agentsWithPositions.forEach((agent) => {
      if (!agent.x || !agent.y) return

      // Draw circle
      ctx.beginPath()
      ctx.arc(agent.x, agent.y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = "#8b5cf6"
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "#fff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(agent.name.substring(0, 8), agent.x, agent.y - 30)
    })
  }, [agents, interactions])

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="w-full h-full border border-border rounded-lg bg-background"
    />
  )
}
