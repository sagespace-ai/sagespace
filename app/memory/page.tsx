"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon, EyeIcon, ScaleIcon } from "@/components/icons"

export default function MemoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Agent Memory</h1>
          <div className="flex items-center gap-2">
            <Link href="/observatory">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <EyeIcon className="w-4 h-4 mr-1" />
                Observatory
              </Button>
            </Link>
            <Link href="/council">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <ScaleIcon className="w-4 h-4 mr-1" />
                Council
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <HomeIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm p-6">
          <CardHeader>
            <CardTitle className="text-white">Agent Learning Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400">
              Track what agents have learned across sessions. Coming soon: detailed memory visualization.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
