"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "@/components/icons"

export default function UniverseMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Universe Map</h1>
          <Link href="/demo">
            <Button variant="ghost" size="sm" className="text-slate-300">
              <HomeIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="text-slate-400 text-center mt-12">Spatial visualization of your agent universe coming soon</div>
      </div>
    </div>
  )
}
