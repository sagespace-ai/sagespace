"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@/components/icons"
import Link from "next/link"
import { SpatialMap } from "@/components/spatial-map"

interface Agent {
  id: string
  name: string
  role: string
  avatar: string
  status: string
  harmony_score: number
}

export default function UniverseMapPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents")
      const data = await response.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error("Error fetching agents:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/playground">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Universe Map
            </h1>
            <p className="text-slate-400 mt-2">Explore the spatial arrangement of your agent universe</p>
          </div>
        </div>

        <div className="flex justify-center">
          {loading ? <div className="text-slate-400">Loading universe...</div> : <SpatialMap agents={agents} />}
        </div>
      </div>
    </div>
  )
}
