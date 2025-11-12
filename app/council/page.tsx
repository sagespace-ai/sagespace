"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { HomeIcon, EyeIcon, BrainIcon } from "@/components/icons"

export default function CouncilPage() {
  const [query, setQuery] = useState("")
  const [deliberation, setDeliberation] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const startDeliberation = async () => {
    if (!query.trim()) return
    setLoading(true)

    try {
      const response = await fetch("/api/council/deliberate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setDeliberation(data)
    } catch (error) {
      console.error("Deliberation error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Agent Council</h1>
          <div className="flex items-center gap-2">
            <Link href="/observatory">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <EyeIcon className="w-4 h-4 mr-1" />
                Observatory
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

        {/* Input */}
        <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm p-6 mb-6">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a complex query for the council to deliberate..."
            className="bg-slate-800 border-slate-700 text-white min-h-[100px] mb-4"
          />
          <Button
            onClick={startDeliberation}
            disabled={loading || !query.trim()}
            className="bg-gradient-to-r from-cyan-500 to-purple-500"
          >
            {loading ? "Deliberating..." : "Start Council Deliberation"}
          </Button>
        </Card>

        {/* Results */}
        {deliberation && (
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm p-6">
            <CardHeader>
              <CardTitle className="text-white">Council Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">{deliberation.consensus || "Deliberation complete"}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
