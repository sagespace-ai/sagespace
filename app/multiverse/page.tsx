"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HomeIcon } from "@/components/icons"

export default function MultiversePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Multiverse Conversations</h1>
          <Link href="/demo">
            <Button variant="ghost" size="sm" className="text-slate-300">
              <HomeIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm p-6">
          <p className="text-slate-400">Your persistent conversations will appear here.</p>
        </Card>
      </div>
    </div>
  )
}
