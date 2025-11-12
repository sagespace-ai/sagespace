"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon, ScaleIcon, BrainIcon, PlusIcon } from "@/components/icons"

export default function ObservatoryPage() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => setAgents(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Agent Observatory</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-300">
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Agent
            </Button>
            <Link href="/council">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <ScaleIcon className="w-4 h-4 mr-1" />
                Council
              </Button>
            </Link>
            <Link href="/memory">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <BrainIcon className="w-4 h-4 mr-1" />
                Memory
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <HomeIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="text-center text-slate-400">Loading agents...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="text-4xl mb-2">{agent.avatar || "🤖"}</div>
                  <CardTitle className="text-white">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-2">{agent.role}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-slate-400">Active</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
